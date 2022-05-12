const jwt          = require('jsonwebtoken');
const conn         = require('../dbConnection').promise();
const crypto       = require('crypto');
const axios        = require('axios');
const db_dev       = require('../dbConnection');
const { param }    = require('express/lib/request');
const logger       = require('../logs');

exports.StatusShipped = async(req,res,next) => {
    const [rows] = await conn.execute("SELECT warehouseId,orderNo,orderType,soStatus,orderTime,soReference1,soReference2,deliveryNo,lastShipmentTime FROM DOC_ORDER_HEADER where organizationId='SF' and sostatus = 99 and orderType='SO' limit 10");
    const isi = [];
    if(rows.length > 0)
    {
        for (let index = 0; index < rows.length; index++) {
            const element = rows[index];
            var   date    = new Date(element.lastShipmentTime).toISOString().replace('T', ' ').substring(0, 19);
            const data = {
                "order_id"       : element.soReference1,
                "invoice_ref_num": element.soReference2,
                "shop_id"        : element.warehouseId,
                "warehouse_id"   : element.warehouseId,
                "order_status"   : element.soStatus,
                "awb"            : element.deliveryNo,
                "shipped_date"   : date
            };
            let res1 = await axios({
                url: 'https://api.jblstore.co.id/api/titipaja/shippedorders',
                method: 'post',
                headers: {
                    'Authorization': 'Bearer hZW5lZDhmNWI3ZTc0Mzk4MTQzYhZW5lZDhmNWI3ZTc0Mzk4MTQzYWI3ZTc0Mzk4MTQzhZW5lZDhmNWI3ZTc0Mz',
                    'Content-Type' : 'application/json'
                },
                data : data
            });
            
            const data1 = res1.data;
            isi.push(data1);
        }
        return res.json({
            status : 200,
            message: 'success',
            count  : rows.length,
            data   : isi
        });
    }
    else
    {
        return res.json({
            status : 404,
            message: 'failed',
            count  : rows.length,
            data   : "Order Shipped not Found !!"
        });
    }
}

exports.requestAck = async(req,res,next) => {
    const [rows] = await conn.execute("SELECT warehouseId,orderNo,orderType,soStatus,orderTime,soReference1,soReference2,deliveryNo,lastShipmentTime FROM DOC_ORDER_HEADER where organizationId='SF' and sostatus = 99 and orderType='SO' limit 10");
    const isi = [];
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        var   date    = new Date(element.lastShipmentTime).toISOString().replace('T', ' ').substring(0, 19);
        let res1 = await axios({
            url: 'https://api.jblstore.co.id/api/titipaja/'+element.orderNo+'/ack',
            method: 'post',
            headers: {
                'Authorization': 'Bearer hZW5lZDhmNWI3ZTc0Mzk4MTQzYhZW5lZDhmNWI3ZTc0Mzk4MTQzYWI3ZTc0Mzk4MTQzhZW5lZDhmNWI3ZTc0Mz',
                'Content-Type' : 'application/json'
            },
            // data : data
        });
        
        const data1 = res1.data;
        isi.push(data1);
    }
    return res.json({
        status : 200,
        message: 'success',
        count  : rows.length,
        data   : isi
    });
}

exports.requestNotAck = async(req,res,next) => {
    const [rows] = await conn.execute("SELECT warehouseId,orderNo,orderType,soStatus,orderTime,soReference1,soReference2,deliveryNo,lastShipmentTime FROM DOC_ORDER_HEADER where organizationId='SF' and sostatus = 99 and orderType='SO' limit 10");
    const isi = [];
    if(rows.length > 0)
    {
        for (let index = 0; index < rows.length; index++) {
            const element = rows[index];
            // var   date    = new Date(element.lastShipmentTime).toISOString().replace('T', ' ').substring(0, 19);
            const data = {
                "reason_code": 1,
                "reason"     : "out of stock"
            };
            let res1 = await axios({
                url: 'https://api.jblstore.co.id/api/titipaja/'+element.orderNo+'/ack',
                // url: 'https://api.jblstore.co.id/api/titipaja/636963965/nack',
                method: 'post',
                headers: {
                    'Authorization': 'Bearer hZW5lZDhmNWI3ZTc0Mzk4MTQzYhZW5lZDhmNWI3ZTc0Mzk4MTQzYWI3ZTc0Mzk4MTQzhZW5lZDhmNWI3ZTc0Mz',
                    'Content-Type' : 'application/json'
                },
                data : data
            });
            
            const data1 = res1.data;
            isi.push(data1);
        }
        return res.json({
            status : 200,
            message: 'success',
            count  : rows.length,
            data   : isi
        });
    }
    else
    {
        return res.json({
            status : 404,
            message: 'failed',
            count  : rows.length,
            data   : "Order Shipped not Found !!"
        });
    }
}

exports.syncStockJbl = async(req,res,next)=>{
    logger.info(req.path);
    const [rows] = await conn.execute("SELECT A1.WAREHOUSEID, A1.SKU, B.SKUDESCR1, IFNULL(ROUND(A.QtyOnHold), 0) holdQty, C.CUSTOMERID, C.CUSTOMERDESCR1, IFNULL(ROUND(SUM(CASE WHEN D.locationAttribute IN('OK', 'NU') AND C1.lotatt08 = 'N' THEN A.qty - A.QtyAllocated - A.QtyOnHold - A.QtyRPOut - A.QtyMVOut ELSE 0 END)), 0) TOTALQTY FROM ( SELECT organizationId, warehouseId, toSKU AS sku, fmCustomerId AS customerId FROM act_transaction_log atl WHERE ORGANIZATIONID = 'SF' AND WAREHOUSEID IN( SELECT warehouseid FROM bsm_warehouse WHERE warehouseid = 'TITIPAJA' AND activeflag = 'Y') AND toCustomerId IN( SELECT customerId FROM BAS_SKU WHERE organizationId = 'SF' AND customerid = 'HUAWEI' GROUP BY customerId) GROUP BY organizationId, warehouseId, toSku) A1 LEFT JOIN INV_LOT_LOC_ID A ON A.organizationId = A1.organizationId AND A.warehouseId = A1.warehouseId AND A.sku = A1.sku AND A.customerId = A1.customerId LEFT JOIN BAS_SKU B ON B.SKU = A1.SKU AND B.CUSTOMERID = A1.CUSTOMERID AND B.ORGANIZATIONID = A1.ORGANIZATIONID LEFT JOIN Inv_lot_att C1 ON C1.lotnum = A.lotnum AND C1.customerid = A1.customerId AND C1.organizationId = A1.organizationId LEFT JOIN BAS_CUSTOMER C ON C.CUSTOMERID = A1.CUSTOMERID AND C.CUSTOMERTYPE = 'OW' AND C.ORGANIZATIONID = A1.ORGANIZATIONID LEFT JOIN bas_location D ON D.locationid = A.locationId AND D.warehouseId = A1.warehouseId AND D.organizationId = A1.organizationId WHERE C.UDF01 IN('N', 'NT') AND B.SKU <> 'FULLCARTON' GROUP BY A1.ORGANIZATIONID, A1.WAREHOUSEID, A1.SKU, A1.CUSTOMERID, B.SKUDESCR1, C.CUSTOMERDESCR1");
    const isi = [];
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        const data = {
            "product_id": element.SKU,
            "new_stock" : element.TOTALQTY,
        };
        logger.info(JSON.stringify(data));
        let res1 = await axios({
            url: 'https://api.jblstore.co.id/api/titipaja/syncstock',
            method: 'post',
            headers: {
                'Authorization': 'Bearer hZW5lZDhmNWI3ZTc0Mzk4MTQzYhZW5lZDhmNWI3ZTc0Mzk4MTQzYWI3ZTc0Mzk4MTQzhZW5lZDhmNWI3ZTc0Mz',
                'Content-Type' : 'application/json'
            },
            data : data
        });
        
        const data1 = res1.data;
        isi.push(data1);
    }
    logger.info(JSON.stringify(isi));
    return res.json({
        status : 200,
        message: 'success',
        count  : rows.length,
        data   : isi
    });
}

exports.syncUpdateStock = async(req,res,next)=>{
    const [rows] = await conn.execute("SELECT A1.WAREHOUSEID, A1.SKU, B.SKUDESCR1, IFNULL(ROUND(A.QtyOnHold), 0) holdQty, C.CUSTOMERID, C.CUSTOMERDESCR1, IFNULL(ROUND(SUM(CASE WHEN D.locationAttribute IN('OK', 'NU') AND C1.lotatt08 = 'N' THEN A.qty - A.QtyAllocated - A.QtyOnHold - A.QtyRPOut - A.QtyMVOut ELSE 0 END)), 0) TOTALQTY FROM (SELECT organizationId, warehouseId, toSKU AS sku, fmCustomerId AS customerId FROM act_transaction_log atl WHERE ORGANIZATIONID = 'SF' AND WAREHOUSEID IN(SELECT warehouseid FROM bsm_warehouse WHERE warehouseid = ? AND activeflag = 'Y') AND toCustomerId IN(SELECT customerId FROM BAS_SKU WHERE organizationId = 'SF' AND sku = ? GROUP BY customerId) AND toSku = ? GROUP BY organizationId, warehouseId, toSku) A1 LEFT JOIN INV_LOT_LOC_ID A ON A.organizationId = A1.organizationId AND A.warehouseId = A1.warehouseId AND A.sku = A1.sku AND A.customerId = A1.customerId LEFT JOIN BAS_SKU B ON B.SKU = A1.SKU AND B.CUSTOMERID = A1.CUSTOMERID AND B.ORGANIZATIONID = A1.ORGANIZATIONID LEFT JOIN Inv_lot_att C1 ON C1.lotnum = A.lotnum AND C1.customerid = A1.customerId AND C1.organizationId = A1.organizationId LEFT JOIN BAS_CUSTOMER C ON C.CUSTOMERID = A1.CUSTOMERID AND C.CUSTOMERTYPE = 'OW' AND C.ORGANIZATIONID = A1.ORGANIZATIONID LEFT JOIN bas_location D ON D.locationid = A.locationId AND D.warehouseId = A1.warehouseId AND D.organizationId = A1.organizationId WHERE  B.SKU <> 'FULLCARTON' GROUP BY A1.ORGANIZATIONID, A1.WAREHOUSEID, A1.SKU, A1.CUSTOMERID, B.SKUDESCR1, C.CUSTOMERDESCR1",[
        req.body.warehouseId,
        req.body.sku,
        req.body.sku
    ]);
    if(rows.length == 0)
    {

        return res.json({
            status : 400,
            message: 'failed',
            count  : rows.length,
            data   : []
        });
    }
    else
    {
        function getTimestamp(){
            return Date.now();
        }

        const pTimestamp = getTimestamp();
        const data = {
            "product_id"       : rows[0].SKU,
            "stock_change"     : rows[0].TOTALQTY,
            "use_case"         : "200",
            "ref_num"          : "ASN/123/2021",
            "changes_timestamp": pTimestamp
        };
        // logger.info(JSON.stringify(data));
        let res1 = await axios({
            url: 'https://api.jblstore.co.id/api/titipaja/updatestock',
            method: 'post',
            headers: {
                'Authorization': 'Bearer hZW5lZDhmNWI3ZTc0Mzk4MTQzYhZW5lZDhmNWI3ZTc0Mzk4MTQzYWI3ZTc0Mzk4MTQzhZW5lZDhmNWI3ZTc0Mz',
                'Content-Type' : 'application/json'
            },
            data : data
        });

        const data1 = res1.data;
        // isi.push(data1);

        return res.json({
            status : 200,
            message: 'success',
            count  : rows.length,
            sku    : rows[0].SKU,
            data   : data1
        });
    }
}