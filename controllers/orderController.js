const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();
const pg = require('../dbConnection_pg');
const crypto = require('crypto');
const db_dev = require('../dbConnection');
const logger = require('../logs');
const  {Readable} = require('stream');
const fast_csv = require("fast-csv");

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

exports.saveOrder = async (req, res, next) => {
    try {
        if(
            !req.headers.authorization||
            !req.headers.authorization.startsWith('Bearer')||
            !req.headers.authorization.split(' ')[1]
        ){
            return res.status(422).json({
                message: "Please provide the token",
            });
        }

        if(req.body.location==='undefine'||!req.body.location){
            return res.status(422).json({
                message: "location shouldn't be empty"
            });
        }else{
            const querySelect='SELECT * from location where code = $1' ;        
            const row = await pg.query(querySelect,[req.body.location]);
            if(row.rowCount == 0){
                 return res.status(422).json({
                    message: "Location not found",
                });
            }else{
                req.body.location_id = row.rows[0].location_id;
            }
        }

        if (req.body.detail.length > 0) {
            req.body.detail.forEach(async data => {
                if(data.item==='undefine'||!data.item){
                    return res.status(422).json({
                        message: "item_id in detail shouldn't be empty"
                    });
                }else{
                    const querySelectItem='SELECT * from item where code = $1 limit 1' ;        
                    const rowItem = await pg.query(querySelectItem,[data.item]);
                    if(rowItem.rowCount == 0){
                        return res.status(422).json({
                            message: "detail item code not found",
                        });
                    }
                    else{
                        const querySelectClient='SELECT * from client where id = $1 limit 1' ;        
                        const rowClient = await pg.query(querySelectClient,[rowItem.rows[0].client_id]);
                        if(rowClient.rowCount == 0){
                            return res.status(422).json({
                                message: "detail client_id not found",
                            });
                        }
                        else{
                            if (rowItem.rows[0].name !== req.body.client) {
                                return res.status(422).json({
                                    message: "client not same with detail.",
                                });
                            }
                            
                        }

                        const querySelectInventory='SELECT * from inventory where item_id = $1 limit 1' ;        
                        const rowInventory = await pg.query(querySelectInventory,[rowItem.rows[0].item_id]);
                        if(rowInventory.rowCount == 0){
                            return res.status(422).json({
                                message: "detail inventory not found",
                            });
                        }
                        else{
                            if (data.order_quantity > rowInventory.rows[0].exist_quantity) {
                                return res.status(422).json({
                                    message: "detail order_quantity should be less than exist_quantity.",
                                });
                            }else if (req.body.location_id != rowInventory.rows[0].location_id) {
                                return res.status(422).json({
                                    message: "detail location not same",
                                });
                            }
                        }

                        
                    }
                }  
                
                if(data.order_quantity==='undefine'||!data.order_quantity){
                    return res.status(422).json({
                        message: "order_quantity in detail shouldn't be empty"
                    });
                }

                if(data.unit_weight==='undefine'||!data.unit_weight){
                    return res.status(422).json({
                        message: "unit_weight in detail shouldn't be empty"
                    });
                }
            });
            
        }else{
            return res.status(422).json({
                message: "details shouldn't be empty"
            });
        }

        
        // check if null
        

        if(req.body.order_code==='undefine'||!req.body.order_code){
            return res.status(422).json({
                message: "order_code shouldn't be empty"
            });
        }else{
            const querySelect='SELECT * from orderheader where order_code = $1' ;        
            const row = await pg.query(querySelect,[req.body.order_code]);
            if(row.rowCount > 1){
                return res.status(422).json({
                    message: "order_code already exist",
                });
            }
        }

        if(req.body.client==='undefine'||!req.body.client){
            return res.status(422).json({
                message: "client shouldn't be empty"
            });
        }else{
            const querySelect='SELECT * from client where name = $1' ;        
            const row = await pg.query(querySelect,[req.body.client]);
            if(row.rowCount == 0){
                return res.status(422).json({
                    message: "client not found",
                });
            }else{
                req.body.client_id = row.rows[0].client_id;
            }
        }

        if(req.body.status==='undefine'||!req.body.status){
            return res.status(422).json({
                message: "status shouldn't be empty"
            });
        }else{
            const querySelect='SELECT * from status where code = $1' ;        
            const row = await pg.query(querySelect,[req.body.status]);
            if(row.rowCount == 0){
                return res.status(422).json({
                    message: "status not found",
                });
            }else{
                req.body.status_id = row.rows[0].status_id;
            }
        }

        if(req.body.delivery_type ==='undefine'||!req.body.delivery_type){
            return res.status(422).json({
                message: "delivery_type shouldn't be empty"
            });
        }else{
            const querySelect='SELECT * from deliverytype where name = $1' ;        
            const row = await pg.query(querySelect,[req.body.delivery_type]);
            if(row.rowCount == 0){
                return res.status(422).json({
                    message: "delivery_type not found",
                });
            }else{
                req.body.delivery_type_id = row.rows[0].delivery_type_id;
            }
        }

        if(req.body.payment_type==='undefine'||!req.body.payment_type){
            return res.status(422).json({
                message: "payment_type shouldn't be empty"
            });
        }
        else{
            const querySelect='SELECT * from paymenttype where name = $1' ;        
            const row = await pg.query(querySelect,[req.body.payment_type]);
            if(row.rowCount == 0){
                return res.status(422).json({
                    message: "payment_type not found",
                });
            }else{
                req.body.payment_type_id = row.rows[0].payment_type_id;
            }
        }

        if(!req.body.distributor==='undefine'|| req.body.distributor){
            const querySelect='SELECT * from distributor where code = $1' ;        
            const row = await pg.query(querySelect,[req.body.distributor]);
            if(row.rowCount > 0){
                req.body.distributor_id = row.rows[0].distributor_id;
            }
        }

        if(!req.body.dropshipper==='undefine'|| req.body.dropshipper){
            const querySelect='SELECT * from dropshipper where code = $1' ;        
            const row = await pg.query(querySelect,[req.body.distributor]);
            if(row.rowCount > 0){
                req.body.dropshipper_id = row.rows[0].dropshipper_id;
            }
        }

        if(req.body.channel==='undefine'||!req.body.channel){
            return res.status(422).json({
                message: "channel shouldn't be empty"
            });
        }else{
            const querySelect='SELECT * from channel where name = $1' ;        
            const row = await pg.query(querySelect,[req.body.channel]);
            if(row.rowCount == 0){
                return res.status(422).json({
                    message: "channel not found",
                });
            }else{
                req.body.channel_id = row.rows[0].channel_id;
            }
        }

        if(req.body.stock_type==='undefine'||!req.body.stock_type){
            return res.status(422).json({
                message: "stock_type shouldn't be empty"
            });
        }
        else{
            const querySelect='SELECT * from stocktype where name = $1' ;        
            const row = await pg.query(querySelect,[req.body.stock_type]);
            if(row.rowCount == 0){
                return res.status(422).json({
                    message: "stock_type not found",
                });
            }else{
                req.body.stock_type_id = row.rows[0].stock_type_id;
            }
        }

        if(req.body.order_type==='undefine'||!req.body.order_type){
            return res.status(422).json({
                message: "order_type shouldn't be empty"
            });
        }
        else{
            const querySelect='SELECT * from ordertype where name = $1' ;        
            const row = await pg.query(querySelect,[req.body.order_type]);
            if(row.rowCount == 0){
                return res.status(422).json({
                    message: "order_type not found",
                });
            }else{
                req.body.order_type_id = row.rows[0].order_type_id;
            }
        }

        if(req.body.recipient_name==='undefine'||!req.body.recipient_name){
            return res.status(422).json({
                message: "recipient_name shouldn't be empty"
            });
        }

        if(req.body.recipient_phone==='undefine'||!req.body.recipient_phone){
            return res.status(422).json({
                message: "recipient_phone shouldn't be empty"
            });
        }

        if(req.body.recipient_address==='undefine'||!req.body.recipient_address){
            return res.status(422).json({
                message: "recipient_address shouldn't be empty"
            });
        }

        if(req.body.total_koli==='undefine'||!req.body.total_koli){
            return res.status(422).json({
                message: "total_koli shouldn't be empty"
            });
        }

        if(req.body.total_weight==='undefine'||!req.body.total_weight){
            return res.status(422).json({
                message: "total_weight shouldn't be empty"
            });
        }

        if(req.body.shipping_price==='undefine'||!req.body.shipping_price){
            return res.status(422).json({
                message: "shipping_price shouldn't be empty"
            });
        }

        if(req.body.total_price==='undefine'||!req.body.total_price){
            return res.status(422).json({
                message: "total_price shouldn't be empty"
            });
        }

        if(req.body.cod_price==='undefine'||!req.body.cod_price){
            return res.status(422).json({
                message: "cod_price shouldn't be empty"
            });
        }

        if(req.body.dfod_price==='undefine'||!req.body.dfod_price){
            return res.status(422).json({
                message: "dfod_price shouldn't be empty"
            });
        }

        if(req.body.order_type==='undefine'||!req.body.order_type){
            return res.status(422).json({
                message: "order_type shouldn't be empty"
            });
        }

        // set for if type data in database int
        if(req.body.location_id===''){
            req.body.location_id = 0
        }
        if(req.body.location_to===''){
            req.body.location_to = 0
        }
        if(req.body.client_id===''){
            req.body.client_id = 0
        }
        if(req.body.shop_configuration_id===''){
            req.body.shop_configuration_id = 0
        }
        if(req.body.status_id===''){
            req.body.status_id = 0
        }
        if(req.body.delivery_type_id===''){
            req.body.delivery_type_id = 0
        }
        if(req.body.payment_type_id===''){
            req.body.payment_type_id = 0
        }
        if(req.body.distributor_id===''){
            req.body.distributor_id = 0
        }
        if(req.body.dropshipper_id===''){
            req.body.dropshipper_id = 0
        }
        if(req.body.channel_id===''){
            req.body.channel_id = 0
        }
        if(req.body.stock_type_id===''){
            req.body.stock_type_id = 0
        }
        if(req.body.order_type_id===''){
            req.body.order_type_id = 0
        }
        if(req.body.shipping_price===''){
            req.body.shipping_price = 0
        }
        if(req.body.total_price===''){
            req.body.total_price = 0
        }
        if(req.body.flag_cob===''){
            req.body.flag_cob = 0
        }
        if(req.body.insurance===''){
            req.body.insurance = 0
        }
        if(req.body.wh_before===''){
            req.body.wh_before = 0
        }
        if(req.body.order_type===''){
            req.body.order_type = 0
        }
        if(req.body.fullfilmenttype_configuration_id===''){
            req.body.fullfilmenttype_configuration_id = 0
        }
        if(req.body.total_product_price===''){
            req.body.total_product_price = 0
        }
        if(req.body.is_insurance===''){
            req.body.is_insurance = 0
        }

        



        
        //let milliseconds = new Date().getTime();
        //let code = "INV/"+dateString()+"/XX/V/"+milliseconds+"_CASE_5_PHASE_1";
        req.body.code = req.body.order_code;
        //req.body.order_code = code;
        req.body.created_date = new Date();
        req.body.modified_date = new Date();
        req.body.created_by = 0;
        req.body.modified_by = 0;
        req.body.payment_date = new Date();

        const queryText = `INSERT INTO orderheader("order_code", "location_id", "location_to", "client_id", "shop_configuration_id", "status_id", "delivery_type_id", "payment_type_id", "distributor_id", "dropshipper_id", "channel_id", "stock_type_id", "order_type_id", "ref_order_id", "code", "order_date", "booking_number", "waybill_number", "recipient_name", "recipient_phone", "recipient_email", "recipient_address", "recipient_district", "recipient_city", "recipient_province", "recipient_country", "recipient_postal_code", "latitude", "longitude", "buyer_name", "buyer_phone", "buyer_email", "buyer_address", "buyer_district", "buyer_city", "buyer_province", "buyer_country", "buyer_postal_code", "total_koli", "total_weight", "shipping_price", "total_price", "cod_price", "dfod_price", "stock_source", "notes", "remark", "created_date", "modified_date", "created_by", "modified_by", "store_name", "created_name", "order_source", "discount", "merchant_name", "merchant_phone", "merchant_address", "merchant_country", "merchant_province", "merchant_city", "merchant_district", "isfulfillment", "discount_point", "discount_seller", "discount_platform", "discount_shipping", "payment_date", "flag_cob", "insurance", "wh_before", "order_type", "fullfilmenttype_configuration_id", "total_product_price", "is_insurance", "gift_notes")
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50,$51,$52,$53,$54,$55,$56,$57,$58,$59,$60,$61,$62,$63,$64,$65,$66,$67,$68,$69,$70,$71,$72,$73,$74,$75,$76) RETURNING order_header_id`;
        const values = [
                req.body.order_code,
                req.body.location_id,
                req.body.location_to,
                req.body.client_id,
                req.body.shop_configuration_id,
                req.body.status_id,
                req.body.delivery_type_id,
                req.body.payment_type_id,
                req.body.distributor_id,
                req.body.dropshipper_id,
                req.body.channel_id,
                req.body.stock_type_id,
                req.body.order_type_id,
                req.body.ref_order_id,
                req.body.code,
                req.body.order_date,
                req.body.booking_number,
                req.body.waybill_number,
                req.body.recipient_name,
                req.body.recipient_phone,
                req.body.recipient_email,
                req.body.recipient_address,
                req.body.recipient_district,
                req.body.recipient_city,
                req.body.recipient_province,
                req.body.recipient_country,
                req.body.recipient_postal_code,
                req.body.latitude,
                req.body.longitude,
                req.body.buyer_name,
                req.body.buyer_phone,
                req.body.buyer_email,
                req.body.buyer_address,
                req.body.buyer_district,
                req.body.buyer_city,
                req.body.buyer_province,
                req.body.buyer_country,
                req.body.buyer_postal_code,
                req.body.total_koli,
                req.body.total_weight,
                req.body.shipping_price,
                req.body.total_price,
                req.body.cod_price,
                req.body.dfod_price,
                req.body.stock_source,
                req.body.notes,
                req.body.remark,
                req.body.created_date,
                req.body.modified_date,
                req.body.created_by,
                req.body.modified_by,
                req.body.store_name,
                req.body.created_name,
                req.body.order_source,
                req.body.discount,
                req.body.merchant_name,
                req.body.merchant_phone,
                req.body.merchant_address,
                req.body.merchant_country,
                req.body.merchant_province,
                req.body.merchant_city,
                req.body.merchant_district,
                req.body.isfulfillment,
                req.body.discount_point,
                req.body.discount_seller,
                req.body.discount_platform,
                req.body.discount_shipping,
                req.body.payment_date,
                req.body.flag_cob,
                req.body.insurance,
                req.body.wh_before,
                req.body.order_type,
                req.body.fullfilmenttype_configuration_id,
                req.body.total_product_price,
                req.body.is_insurance,
                req.body.gift_notes
            ];
        pg.query(queryText, values,function (err, data) {
            if (err) {
                console.log(err)
            } else {
                if (req.body.detail.length > 0) {
                    Promise.all(req.body.detail.map(async (detail) => {
                        if(!detail.status==='undefine'||detail.status){
                            const querySelect='SELECT * from status where code = $1' ;        
                            const row = await pg.query(querySelect,[req.body.status]);
                            if(row.rowCount > 0){
                                detail.status_id = row.rows[0].status_id;
                            }
                        }
                        
                        
                        detail.order_code =  req.body.order_code;
                        detail.order_header_id = data.rows[0].order_header_id
                        detail.created_date = new Date();
                        detail.modified_date = new Date();
                        detail.created_by = 0;
                        detail.modified_by = 0;

                        const queryDetail = `INSERT INTO orderdetail("order_code","inventory_id", "order_header_id", "item_id","order_quantity","unit_price","total_unit_price","unit_weight","status_id","modified_date","modified_by","created_date","created_by","ref_detail_id")
                        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`;
                        
                        const valuesDetail = [
                            detail.order_code,
                            detail.inventory_id,
                            detail.order_header_id,
                            detail.item_id,
                            detail.order_quantity,
                            detail.unit_price,
                            detail.total_unit_price,
                            detail.unit_weight,
                            detail.status_id,
                            detail.created_date,
                            detail.created_by,
                            detail.modified_date,
                            detail.modified_by,
                            detail.ref_detail_id
                        ];
                        pg.query(queryDetail, valuesDetail,function (err, data) {
                           
                        })
                    }));
                    return res.json({
                        status:200,
                        message:'Success',
                        response_time:durationInMilliseconds.toLocaleString() + " s",
                        total_row:data.rowCount ,
                        data:data.rows[0]
                    });
                }else{
                    return res.json({
                        status:200,
                        message:'Success',
                        response_time:durationInMilliseconds.toLocaleString() + " s",
                        total_row:data.rowCount ,
                        data:data.rows[0]
                    });  
                }
                
            }
        });


    }catch(err){
        console.log(err)
        return res.json({
            status:500,
            message:'Failed',
            response_time:durationInMilliseconds.toLocaleString() + " s",
            data:[]
        });
        // next(err);
    }
}

// exports.updateOrder = async (req, res, next) => {
//     try {
//         if(
//             !req.headers.authorization||
//             !req.headers.authorization.startsWith('Bearer')||
//             !req.headers.authorization.split(' ')[1]
//         ){
//             return res.status(422).json({
//                 message: "Please provide the token",
//             });
//         }

//         if(req.body.order_header_id==='undefine'||!req.body.order_header_id){
//             return res.status(422).json({
//                 message: "order_header_id shouldn't be empty"
//             });
//         }

//         if(req.body.location==='undefine'||!req.body.location){
//             return res.status(422).json({
//                 message: "location shouldn't be empty"
//             });
//         }else{
//             const querySelect='SELECT * from location where code = $1' ;        
//             const row = await pg.query(querySelect,[req.body.location]);
//             if(row.rowCount == 0){
//                 console.log("test")
//                 return res.status(422).json({
//                     message: "Location not found",
//                 });
//             }else{
//                 req.body.location_id = row.rows[0].location_id;
//             }
//         }

//         if(req.body.client==='undefine'||!req.body.client){
//             return res.status(422).json({
//                 message: "client shouldn't be empty"
//             });
//         }else{
//             const querySelect='SELECT * from client where name = $1' ;        
//             const row = await pg.query(querySelect,[req.body.client]);
//             if(row.rowCount == 0){
//                 return res.status(422).json({
//                     message: "client not found",
//                 });
//             }else{
//                 req.body.client_id = row.rows[0].client_id;
//             }
//         }

//         if(req.body.status==='undefine'||!req.body.status){
//             return res.status(422).json({
//                 message: "status shouldn't be empty"
//             });
//         }else{
//             const querySelect='SELECT * from status where code = $1' ;        
//             const row = await pg.query(querySelect,[req.body.status]);
//             if(row.rowCount == 0){
//                 return res.status(422).json({
//                     message: "status not found",
//                 });
//             }else{
//                 req.body.status_id = row.rows[0].status_id;
//             }
//         }

//         if(req.body.delivery_type ==='undefine'||!req.body.delivery_type){
//             return res.status(422).json({
//                 message: "delivery_type shouldn't be empty"
//             });
//         }else{
//             const querySelect='SELECT * from deliverytype where name = $1' ;        
//             const row = await pg.query(querySelect,[req.body.delivery_type]);
//             if(row.rowCount == 0){
//                 return res.status(422).json({
//                     message: "delivery_type not found",
//                 });
//             }else{
//                 req.body.delivery_type_id = row.rows[0].delivery_type_id;
//             }
//         }

//         if(req.body.payment_type==='undefine'||!req.body.payment_type){
//             return res.status(422).json({
//                 message: "payment_type shouldn't be empty"
//             });
//         }
//         else{
//             const querySelect='SELECT * from paymenttype where name = $1' ;        
//             const row = await pg.query(querySelect,[req.body.payment_type]);
//             if(row.rowCount == 0){
//                 return res.status(422).json({
//                     message: "payment_type not found",
//                 });
//             }else{
//                 req.body.payment_type_id = row.rows[0].payment_type_id;
//             }
//         }

//         if(!req.body.distributor==='undefine'|| req.body.distributor){
//             const querySelect='SELECT * from distributor where code = $1' ;        
//             const row = await pg.query(querySelect,[req.body.distributor]);
//             if(row.rowCount > 0){
//                 req.body.distributor_id = row.rows[0].distributor_id;
//             }
//         }

//         if(!req.body.dropshipper==='undefine'|| req.body.dropshipper){
//             const querySelect='SELECT * from dropshipper where code = $1' ;        
//             const row = await pg.query(querySelect,[req.body.distributor]);
//             if(row.rowCount > 0){
//                 req.body.dropshipper_id = row.rows[0].dropshipper_id;
//             }
//         }

//         if(req.body.channel==='undefine'||!req.body.channel){
//             return res.status(422).json({
//                 message: "channel shouldn't be empty"
//             });
//         }else{
//             const querySelect='SELECT * from channel where name = $1' ;        
//             const row = await pg.query(querySelect,[req.body.channel]);
//             if(row.rowCount == 0){
//                 return res.status(422).json({
//                     message: "channel not found",
//                 });
//             }else{
//                 req.body.channel_id = row.rows[0].channel_id;
//             }
//         }

//         if(req.body.stock_type==='undefine'||!req.body.stock_type){
//             return res.status(422).json({
//                 message: "stock_type shouldn't be empty"
//             });
//         }
//         else{
//             const querySelect='SELECT * from stocktype where name = $1' ;        
//             const row = await pg.query(querySelect,[req.body.stock_type]);
//             if(row.rowCount == 0){
//                 return res.status(422).json({
//                     message: "stock_type not found",
//                 });
//             }else{
//                 req.body.stock_type_id = row.rows[0].stock_type_id;
//             }
//         }

//         if(req.body.order_type==='undefine'||!req.body.order_type){
//             return res.status(422).json({
//                 message: "order_type shouldn't be empty"
//             });
//         }
//         else{
//             const querySelect='SELECT * from ordertype where name = $1' ;        
//             const row = await pg.query(querySelect,[req.body.order_type]);
//             if(row.rowCount == 0){
//                 return res.status(422).json({
//                     message: "order_type not found",
//                 });
//             }else{
//                 req.body.order_type_id = row.rows[0].order_type_id;
//             }
//         }

//         if(req.body.recipient_name==='undefine'||!req.body.recipient_name){
//             return res.status(422).json({
//                 message: "recipient_name shouldn't be empty"
//             });
//         }

//         if(req.body.recipient_phone==='undefine'||!req.body.recipient_phone){
//             return res.status(422).json({
//                 message: "recipient_phone shouldn't be empty"
//             });
//         }

//         if(req.body.recipient_address==='undefine'||!req.body.recipient_address){
//             return res.status(422).json({
//                 message: "recipient_address shouldn't be empty"
//             });
//         }

//         if(req.body.total_koli==='undefine'||!req.body.total_koli){
//             return res.status(422).json({
//                 message: "total_koli shouldn't be empty"
//             });
//         }

//         if(req.body.total_weight==='undefine'||!req.body.total_weight){
//             return res.status(422).json({
//                 message: "total_weight shouldn't be empty"
//             });
//         }

//         if(req.body.shipping_price==='undefine'||!req.body.shipping_price){
//             return res.status(422).json({
//                 message: "shipping_price shouldn't be empty"
//             });
//         }

//         if(req.body.total_price==='undefine'||!req.body.total_price){
//             return res.status(422).json({
//                 message: "total_price shouldn't be empty"
//             });
//         }

//         if(req.body.cod_price==='undefine'||!req.body.cod_price){
//             return res.status(422).json({
//                 message: "cod_price shouldn't be empty"
//             });
//         }

//         if(req.body.dfod_price==='undefine'||!req.body.dfod_price){
//             return res.status(422).json({
//                 message: "dfod_price shouldn't be empty"
//             });
//         }

//         if(req.body.order_type==='undefine'||!req.body.order_type){
//             return res.status(422).json({
//                 message: "order_type shouldn't be empty"
//             });
//         }

//         // set for if type data in database int
//         if(req.body.location_id===''){
//             req.body.location_id = 0
//         }
//         if(req.body.location_to===''){
//             req.body.location_to = 0
//         }
//         if(req.body.client_id===''){
//             req.body.client_id = 0
//         }
//         if(req.body.shop_configuration_id===''){
//             req.body.shop_configuration_id = 0
//         }
//         if(req.body.status_id===''){
//             req.body.status_id = 0
//         }
//         if(req.body.delivery_type_id===''){
//             req.body.delivery_type_id = 0
//         }
//         if(req.body.payment_type_id===''){
//             req.body.payment_type_id = 0
//         }
//         if(req.body.distributor_id===''){
//             req.body.distributor_id = 0
//         }
//         if(req.body.dropshipper_id===''){
//             req.body.dropshipper_id = 0
//         }
//         if(req.body.channel_id===''){
//             req.body.channel_id = 0
//         }
//         if(req.body.stock_type_id===''){
//             req.body.stock_type_id = 0
//         }
//         if(req.body.order_type_id===''){
//             req.body.order_type_id = 0
//         }
//         if(req.body.shipping_price===''){
//             req.body.shipping_price = 0
//         }
//         if(req.body.total_price===''){
//             req.body.total_price = 0
//         }
//         if(req.body.flag_cob===''){
//             req.body.flag_cob = 0
//         }
//         if(req.body.insurance===''){
//             req.body.insurance = 0
//         }
//         if(req.body.wh_before===''){
//             req.body.wh_before = 0
//         }
//         if(req.body.order_type===''){
//             req.body.order_type = 0
//         }
//         if(req.body.fullfilmenttype_configuration_id===''){
//             req.body.fullfilmenttype_configuration_id = 0
//         }
//         if(req.body.total_product_price===''){
//             req.body.total_product_price = 0
//         }
//         if(req.body.is_insurance===''){
//             req.body.is_insurance = 0
//         }

//         if (req.body.detail.length > 0) {
//             req.body.detail.forEach(data => {

//                 if(data.order_detail_id==='undefine'||!data.order_detail_id){
//                     return res.status(422).json({
//                         message: "order_detail_id in detail shouldn't be empty"
//                     });
//                 } 

//                 if(data.item_id==='undefine'||!data.item_id){
//                     return res.status(422).json({
//                         message: "item_id in detail shouldn't be empty"
//                     });
//                 }  
                
//                 if(data.order_quantity==='undefine'||!data.order_quantity){
//                     return res.status(422).json({
//                         message: "order_quantity in detail shouldn't be empty"
//                     });
//                 }

//                 if(data.unit_weight==='undefine'||!data.unit_weight){
//                     return res.status(422).json({
//                         message: "unit_weight in detail shouldn't be empty"
//                     });
//                 }
//             });
            
//         }

        
//         let milliseconds = new Date().getTime();
//         //req.body.created_date = new Date();
//         req.body.modified_date = new Date();
//         req.body.modified_by = 0;
//         req.body.payment_date = new Date();

//         const queryText = `UPDATE orderheader set location_id = $2, location_to = $3, client_id= $4, shop_configuration_id = $5, status_id = $6, delivery_type_id = $7, payment_type_id = $8, distributor_id = $9, dropshipper_id = $10, channel_id = $11, stock_type_id = $12, order_type_id = $13, ref_order_id = $14, order_date = $15, booking_number = $16, waybill_number = $17, recipient_name = $18,  recipient_phone = $19 ,  recipient_email = $20 ,  recipient_address = $21 ,  recipient_district = $22 ,  recipient_city = $23 ,  recipient_province = $24 ,  recipient_country = $25 ,  recipient_postal_code = $26 ,  latitude = $27 ,  longitude = $28 ,  buyer_name = $29 ,  buyer_phone = $30 ,  buyer_email = $31 ,  buyer_address = $32 ,  buyer_district = $33 ,  buyer_city = $34 ,  buyer_province = $35 ,  buyer_country = $36 ,  buyer_postal_code = $37 ,  total_koli = $38 ,  total_weight = $39 ,  shipping_price = $40 ,  total_price = $41 ,  cod_price = $42 ,  dfod_price = $43 ,  stock_source = $44 ,  notes = $45 ,  remark = $46 ,  modified_date = $47 ,  modified_by = $48 ,  store_name = $49 ,  created_name = $50 ,  order_source = $51 ,  discount = $52 ,  merchant_name = $53 ,  merchant_phone = $54 ,  merchant_address = $55 ,  merchant_country = $56 ,  merchant_province = $57 ,  merchant_city = $58 ,  merchant_district = $59 ,  isfulfillment = $60 ,  discount_point = $61 ,  discount_seller = $62 ,  discount_platform = $63 ,  discount_shipping = $64 ,  payment_date = $65 ,  flag_cob = $66 ,  insurance = $67 ,  wh_before = $68 ,  order_type = $69 ,  fullfilmenttype_configuration_id = $70 ,  total_product_price = $71 ,  is_insurance = $72 ,  gift_notes = $73 where order_header_id = $1`;
//         const values = [
//                 req.body.order_header_id,
//                 req.body.location_id,
//                 req.body.location_to,
//                 req.body.client_id,
//                 req.body.shop_configuration_id,
//                 req.body.status_id,
//                 req.body.delivery_type_id,
//                 req.body.payment_type_id,
//                 req.body.distributor_id,
//                 req.body.dropshipper_id,
//                 req.body.channel_id,
//                 req.body.stock_type_id,
//                 req.body.order_type_id,
//                 req.body.ref_order_id,
//                 req.body.order_date,
//                 req.body.booking_number,
//                 req.body.waybill_number,
//                 req.body.recipient_name,
//                 req.body.recipient_phone,
//                 req.body.recipient_email,
//                 req.body.recipient_address,
//                 req.body.recipient_district,
//                 req.body.recipient_city,
//                 req.body.recipient_province,
//                 req.body.recipient_country,
//                 req.body.recipient_postal_code,
//                 req.body.latitude,
//                 req.body.longitude,
//                 req.body.buyer_name,
//                 req.body.buyer_phone,
//                 req.body.buyer_email,
//                 req.body.buyer_address,
//                 req.body.buyer_district,
//                 req.body.buyer_city,
//                 req.body.buyer_province,
//                 req.body.buyer_country,
//                 req.body.buyer_postal_code,
//                 req.body.total_koli,
//                 req.body.total_weight,
//                 req.body.shipping_price,
//                 req.body.total_price,
//                 req.body.cod_price,
//                 req.body.dfod_price,
//                 req.body.stock_source,
//                 req.body.notes,
//                 req.body.remark,
//                 req.body.modified_date,
//                 req.body.modified_by,
//                 req.body.store_name,
//                 req.body.created_name,
//                 req.body.order_source,
//                 req.body.discount,
//                 req.body.merchant_name,
//                 req.body.merchant_phone,
//                 req.body.merchant_address,
//                 req.body.merchant_country,
//                 req.body.merchant_province,
//                 req.body.merchant_city,
//                 req.body.merchant_district,
//                 req.body.isfulfillment,
//                 req.body.discount_point,
//                 req.body.discount_seller,
//                 req.body.discount_platform,
//                 req.body.discount_shipping,
//                 req.body.payment_date,
//                 req.body.flag_cob,
//                 req.body.insurance,
//                 req.body.wh_before,
//                 req.body.order_type,
//                 req.body.fullfilmenttype_configuration_id,
//                 req.body.total_product_price,
//                 req.body.is_insurance,
//                 req.body.gift_notes
//             ];
//         pg.query(queryText, values,function (err, data) {
//             if (err) {
//                 console.log(err)
//             } else {
//                 if (req.body.detail.length > 0) {
//                     Promise.all(req.body.detail.map(async (detail) => {
//                         if(!detail.status==='undefine'||detail.status){
//                             const querySelect='SELECT * from status where code = $1' ;        
//                             const row = await pg.query(querySelect,[req.body.status]);
//                             if(row.rowCount > 0){
//                                 detail.status_id = row.rows[0].status_id;
//                             }
//                         }
                        
//                         detail.order_code =  req.body.order_code;
//                         detail.order_header_id = data.rows[0].order_header_id
//                         //detail.created_date = new Date();
//                         detail.modified_date = new Date();
//                         detail.created_by = 0;
//                         detail.modified_by = 0;

//                         const queryDetail = `UPDATE orderdetail set inventory_id = $2 ,order_header_id = $3 ,item_id = $4 ,order_quantity = $5 ,unit_price = $6 ,total_unit_price = $7 ,unit_weight = $8 ,status_id = $9 ,modified_date = $10 ,modified_by = $11 ,ref_detail_id = $12 where order_detail_id = $1 `;
//                         const valuesDetail = [
//                             detail.order_detail_id,
//                             detail.inventory_id,
//                             detail.order_header_id,
//                             detail.item_id,
//                             detail.order_quantity,
//                             detail.unit_price,
//                             detail.total_unit_price,
//                             detail.unit_weight,
//                             detail.status_id,
//                             detail.modified_date,
//                             detail.modified_by,
//                             detail.ref_detail_id
//                         ];
//                         pg.query(queryDetail, valuesDetail,function (err, data) {
                           
//                         })
//                     }));
//                     return res.json({
//                         status:200,
//                         message:'Success',
//                         response_time:durationInMilliseconds.toLocaleString() + " s",
//                         total_row:data.rowCount ,
//                         data:data.rows[0]
//                     });
//                 }else{
//                     return res.json({
//                         status:200,
//                         message:'Success',
//                         response_time:durationInMilliseconds.toLocaleString() + " s",
//                         total_row:data.rowCount ,
//                         data:data.rows[0]
//                     });  
//                 }
                
//             }
//         });


//     }catch(err){
       
//         return res.json({
//             status:500,
//             message:'Failed',
//             response_time:durationInMilliseconds.toLocaleString() + " s",
//             data:[]
//         });
//         // next(err);
//     }
// }

exports.updateOrder = async (req, res, next) => {
    try {
        if(
            !req.headers.authorization||
            !req.headers.authorization.startsWith('Bearer')||
            !req.headers.authorization.split(' ')[1]
        ){
            return res.status(422).json({
                message: "Please provide the token",
            });
        }

        if(req.body.order_code==='undefine'||!req.body.order_code){
            return res.status(422).json({
                message: "order_code shouldn't be empty"
            });
        }else{
            const querySelect='SELECT * from orderheader where order_code = $1' ;        
            const row = await pg.query(querySelect,[req.body.order_code]);
            if(row.rowCount > 1){
                return res.status(422).json({
                    message: "order_code already exist",
                });
            }
        }

        if(req.body.waybill_number==='undefine'||!req.body.waybill_number){
            return res.status(422).json({
                message: "waybill_number shouldn't be empty"
            });
        }

        const queryOrderHeader = "SELECT count(order_header_id) FROM orderheader oh " +
            "WWHERE oh.order_code = $1";
        let responseOrderHeader = await pg.query(queryOrderHeader,
            [
                req.body.order_code
            ]);
        if (responseOrderHeader.rowCount > 0) {
            const updateOrderHeader = "UPDATE orderheader SET waybill_number = ? WHERE order_code = $1";
            await client.query('BEGIN');
            let responseUpdateOH = await pg.query(updateOrderHeader,
                [
                    req.body.waybill_number,
                    req.body.order_code
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

       


    }catch(err){
        console.log(err)
        return res.json({
            status:500,
            message:'Failed',
            response_time:durationInMilliseconds.toLocaleString() + " s",
            data:[]
        });
        // next(err);
    }
}

exports.uploadOrder = async (req, res, next) => {
    try{
        // if(
        //     !req.headers.authorization||
        //     !req.headers.authorization.startsWith('Bearer')||
        //     !req.headers.authorization.split(' ')[1]
        // ){
        //     return res.status(422).json({
        //         message: "Please provide the token",
        //     });
        // }
        if (req.file == undefined) {
            return res.status(400).send("Please upload a CSV file!");
          }  
        let csvRowArray=[];
        let row_insert =[];
        const  readable = new Readable();

        readable._read = () => {}
        readable.push(req.file.buffer)
        readable.push(null)        
        readable.pipe(fast_csv.parse({headers:true}))
        .on("error",(error)=>{
            return res.status(400).send(error.message);
        })
        .on("data", (data) => {csvRowArray.push(data)})
        .on("end", async()=>{
            console.log(data)
        })
    }catch(err){
       console.log(err)
        return res.json({
            status:500,
            message:'Failed',
            response_time:durationInMilliseconds.toLocaleString() + " s",
            data:[]
        });
        // next(err);
    }
}

function dateString(){
    let date = "";
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return yyyy+mm+dd;
}

