const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();
const pg = require('../dbConnection_pg');
const crypto = require('crypto');
const db_dev = require('../dbConnection');
const logger = require('../logs');

const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}
const start = process.hrtime()
const durationInMilliseconds = getDurationInMilliseconds(start)
exports.getOrder = async (req, res, next) => {
    try {

        //const offset = Number([req.body.offset]);
        let page = Number(req.body.page);
        const limit = Number(req.body.limit);
        const date_start = req.body.date_start + ' 00:00:01';
        const date_to = req.body.date_to + ' 23:59:59';
        const shop_id = req.body.shop_id;
        const warehouse_id = req.body.warehouse_id;
        const status = req.body.status;
        //var condition;
        if (date_start == '' || date_to == '') {
            return res.status(422).json({
                status: 422,
                message: "Params date is null",
                data: []
            });
        }
        // else {
        //     var condition = "order_date BETWEEN " + date_start + " 00:00:01 AND " + date_to + " 23:59:59";
        // }
        if (typeof req.body.date_start == 'undefined') {
            return res.status(422).json({
                status: 422,
                message: "Please provide the date_start",
                data: []
            });
        }
        if (typeof req.body.date_to == 'undefined') {
            return res.status(422).json({
                status: 422,
                message: "Please provide the date_to",
                data: []
            });
        }

        if (warehouse_id == null || warehouse_id == '') {
            return res.status(422).json({
                status: 422,
                message: "Params warehouse_id is null",
                data: []
            });
        }

        if (shop_id == null || shop_id == '') {
            return res.status(422).json({
                status: 422,
                message: "Params shop_id is null",
                data: []
            });
        }

        if (status == null || status == '') {
            return res.status(422).json({
                status: 422,
                message: "Params status is null",
                data: []
            });
        }

        // if (req.body.jwt.details.map(x => x.customerId).indexOf(shop_id) === -1) {

        //     return res.json({
        //         status: 500,
        //         message: "failed",
        //         data: "shop_id not found"
        //     });
        // }

        if (limit == '' || limit == null) {
            limit = 10;
        }

        let offset = 0;
        if (page == '' || page == null) {
            page = 1;
        } else if (page > 1) {
            offset = (page - 1) * limit
        }

        const query = "SELECT oh.order_header_id, lc.name as warehouse, lc.code as warehouse_code, c.name as client, c.code as client_code, oh.total_weight, oh.total_price, oh.shipping_price, oh.discount, oh.insurance, oh.cod_price, oh.order_date, oh.order_code,s.name as status, oh.status_id, s.code as status_code, " +
            "dt.name as delivery_type, cr.name as courier, cn.name as channel, c.name as shop_name, st.name as stock_type, pt.name as payment_type, oh.booking_number, oh.waybill_number, oh.recipient_name, oh.recipient_phone, oh.recipient_email, oh.recipient_address, oh.recipient_district, " +
            "oh.recipient_city, oh.recipient_province, oh.recipient_country, oh.recipient_postal_code, oh.created_date " +
            "FROM orderheader oh " +
            "LEFT JOIN client c ON c.client_id = oh.client_id " +
            "LEFT JOIN status s ON s.status_id = oh.status_id " +
            "LEFT JOIN deliverytype dt  ON dt.delivery_type_id = oh.delivery_type_id " +
            "LEFT JOIN courier cr  ON cr.courier_id = dt.courier_id " +
            "LEFT JOIN channel cn ON cn.channel_id = oh.channel_id " +
            "LEFT JOIN stocktype st ON st.stock_type_id = oh.stock_type_id " +
            "LEFT JOIN paymenttype pt ON pt.payment_type_id = oh.payment_type_id " +
            "LEFT JOIN location lc ON lc.location_id = oh.location_id " +
            "WHERE  oh.order_date BETWEEN $1 AND $2 " +
            "AND c.client_id = $3 AND oh.status_id = $4 AND lc.code = $5 " +
            "OFFSET $6 LIMIT $7";

        let response = await pg.query(query,
            [
                date_start,
                date_to,
                shop_id,
                status,
                warehouse_id,
                offset,
                limit
            ]);

        const queryTotal = "SELECT count(oh.order_header_id) as total " +
            "FROM orderheader oh " +
            "LEFT JOIN client c ON c.client_id = oh.client_id " +
            "WHERE  oh.order_date BETWEEN $1 AND $2 " +
            "AND c.client_id = $3 AND oh.status_id = $4 AND oh.location_id = $5 ";

        let responseTotal = await pg.query(queryTotal,
            [
                date_start,
                date_to,
                shop_id,
                status,
                warehouse
            ]);
        let total = responseTotal.rows[0].total;

        let dataResponse = [];

        if (response.rowCount > 0) {
            dataResponse = response.rows

            await Promise.all(dataResponse.map(async (data) => {
                const queryDetail = "SELECT  order_code as code, order_quantity as qty, unit_price, total_unit_price, unit_weight FROM orderdetail WHERE order_code = $1";
                let responseDetail = await pg.query(queryDetail,
                    [
                        data.order_header_id
                    ]);
                data['detail'] = null;
                if (responseDetail.rowCount > 0) {
                    data['detail'] = responseDetail.rows;
                }
            }));

            return res.json({
                status: 200,
                message: 'success',
                response_time: durationInMilliseconds.toLocaleString() + " s",
                lastPage: Math.ceil(total / limit) == page ? true : false,
                pageSize: response.rowCount,
                pageNumer: page == null || page == '' ? 1 : page,
                total: total,
                data: dataResponse
            });
        }

        res.json({
            status: 401,
            message: "Order Not Found",
            response_time: durationInMilliseconds.toLocaleString() + " s",
            data: []
        });

    }
    catch (err) {
        next(err);
    }
}

exports.getDetailOrder = async (req, res, next) => {
    try {
        const orderno = req.body.orderno;
        const shop_id = req.body.shop_id;
        if (orderno == null || orderno == '') {
            return res.status(422).json({
                status: 422,
                message: "Params orderno is null",
                data: []
            });
        }

        if (shop_id == null || shop_id == '') {
            return res.status(422).json({
                status: 422,
                message: "Params shop_id is null",
                data: []
            });
        }
        const query = "SELECT od.order_detail_id, od.order_code, od.inventory_id, od.order_header_id, od.item_id, od.order_quantity, od.unit_price, od.total_unit_price, od.unit_weight, od.status_id, od.created_date, od.ref_detail_id  " +
            "FROM orderdetail od " +
            "LEFT JOIN orderheader oh ON oh.order_header_id = od.order_header_id " +
            "WHERE od.order_code = $1 AND oh.client_id = $2";
        let response = await pg.query(query,
            [
                orderno,
                shop_id
            ]);

        if (response.rowCount > 0) {
            return res.json({
                status: 200,
                message: 'success',
                response_time: durationInMilliseconds.toLocaleString() + " s",
                data: response.rows[0]
            });
        }

        res.json({
            status: 401,
            message: "Order Detail Not Found",
            response_time: durationInMilliseconds.toLocaleString() + " s",
            data: []
        });
    }
    catch (err) {
        next(err);
    }
}


exports.cancleOrder = async (req, res, next) => {

    const client = await pg.connect();
    try {

        const orderno = req.body.orderno;
        if (orderno == null || orderno == '') {
            return res.status(422).json({
                status: 422,
                message: "Params orderno is null",
                data: []
            });
        }

        const queryOrderHeader = "SELECT count(order_header_id) FROM orderheader oh " +
            "LEFT JOIN status s ON s.status_id = oh.status_id " +
            "WHERE s.code NOT IN ('ORD_UNFULFILLED','ORD_OUTSTOCK','ORD_STANDBY','ORD_DELIVERY','ORD_RECEIVED') AND oh.order_code = $1";
        let responseOrderHeader = await pg.query(queryOrderHeader,
            [
                orderno
            ]);
        if (responseOrderHeader.rowCount > 0) {
            const updateOrderHeader = "UPDATE orderheader SET status_id = 14 WHERE order_code = $1";
            await client.query('BEGIN');
            let responseUpdateOH = await pg.query(updateOrderHeader,
                [
                    orderno
                ]);
            await client.query('COMMIT');
            if (responseUpdateOH.rowCount > 0) {
                return res.json({
                    status: 200,
                    message: 'success',
                    response_time: durationInMilliseconds.toLocaleString() + " s",
                    data: null
                });
            }
        }

        res.json({
            status: 401,
            message: "Order Not Found",
            response_time: durationInMilliseconds.toLocaleString() + " s",
            data: []
        });

    }
    catch (err) {
        await client.query('ROLLBACK');
        next(err);
    }
}

exports.searchOrder = async (req, res, next) => {
    try {

        //const offset = Number([req.body.offset]);
        let page = Number(req.body.page);
        const limit = Number(req.body.limit);
        const keyword = req.body.keyword.replace(/\s/g, '');

        if (limit == '' || limit == null) {
            limit = 10;
        }

        let offset = 0;
        if (page == '' || page == null) {
            page = 1;
        } else if (page > 1) {
            offset = (page - 1) * limit
        }

        const query = "SELECT oh.order_header_id, lc.name as warehouse, lc.code as warehouse_code, c.name as client, c.code as client_code, oh.total_weight, oh.total_price, oh.shipping_price, oh.discount, oh.insurance, oh.cod_price, oh.order_date, oh.order_code,s.name as status, oh.status_id, s.code as status_code, " +
            "dt.name as delivery_type, cr.name as courier, cn.name as channel, c.name as shop_name, st.name as stock_type, pt.name as payment_type, oh.booking_number, oh.waybill_number, oh.recipient_name, oh.recipient_phone, oh.recipient_email, oh.recipient_address, oh.recipient_district, " +
            "oh.recipient_city, oh.recipient_province, oh.recipient_country, oh.recipient_postal_code, oh.created_date " +
            "FROM orderheader oh " +
            "LEFT JOIN client c ON c.client_id = oh.client_id " +
            "LEFT JOIN status s ON s.status_id = oh.status_id " +
            "LEFT JOIN deliverytype dt  ON dt.delivery_type_id = oh.delivery_type_id " +
            "LEFT JOIN courier cr  ON cr.courier_id = dt.courier_id " +
            "LEFT JOIN channel cn ON cn.channel_id = oh.channel_id " +
            "LEFT JOIN stocktype st ON st.stock_type_id = oh.stock_type_id " +
            "LEFT JOIN paymenttype pt ON pt.payment_type_id = oh.payment_type_id " +
            "LEFT JOIN location lc ON lc.location_id = oh.location_id " +
            "WHERE oh.order_code LIKE $1 || '%' OR cn.name LIKE $1 || '%' OR s.code = $1 " +
            "OFFSET $2 LIMIT $3";

        let response = await pg.query(query,
            [
                keyword,
                offset,
                limit
            ]);

        const queryTotal = "SELECT count(oh.order_header_id) as total " +
            "FROM orderheader oh " +
            "LEFT JOIN status s ON s.status_id = oh.status_id " +
            "LEFT JOIN channel cn ON cn.channel_id = oh.channel_id " +
            "WHERE oh.order_code LIKE '$1%' OR cn.name LIKE '$1$' OR s.code = $1 ";

        let responseTotal = await pg.query(queryTotal,
            [
                keyword,
            ]);
        let total = responseTotal.rows[0].total;

        let dataResponse = [];

        if (response.rowCount > 0) {
            dataResponse = response.rows

            await Promise.all(dataResponse.map(async (data) => {
                const queryDetail = "SELECT  order_code as code, order_quantity as qty, unit_price, total_unit_price, unit_weight FROM orderdetail WHERE order_code = $1";
                let responseDetail = await pg.query(queryDetail,
                    [
                        data.order_header_id
                    ]);
                data['detail'] = null;
                if (responseDetail.rowCount > 0) {
                    data['detail'] = responseDetail.rows;
                }
            }));

            return res.json({
                status: 200,
                message: 'success',
                response_time: durationInMilliseconds.toLocaleString() + " s",
                lastPage: Math.ceil(total / limit) == page ? true : false,
                pageSize: response.rowCount,
                pageNumer: page == null || page == '' ? 1 : page,
                total: total,
                data: dataResponse
            });
        }

        res.json({
            status: 401,
            message: "Order Not Found",
            response_time: durationInMilliseconds.toLocaleString() + " s",
            data: []
        });

    }
    catch (err) {
        next(err);
    }
}