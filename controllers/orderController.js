const jwt    = require('jsonwebtoken');
const conn   = require('../dbConnection').promise();
const crypto = require('crypto');
const db_dev = require('../dbConnection');

const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}
const start = process.hrtime()
const durationInMilliseconds = getDurationInMilliseconds (start)
exports.getOrder = async (req,res,next) => {
    try{

        const offset     = Number([req.body.offset]);
        const limit      = Number([req.body.limit]);
        const date_start = [req.body.date_start]+' 00:00:01';
        const date_to    = [req.body.date_to] + ' 23:59:59';
        const shop_id    = req.body.shop_id;
        var condition;
        if(date_start == ''|| date_to == '')
        {
            return res.status(422).json({
                status:422,
                message: "Params date is null",
                data:[]
            });
        }
        else
        {
            var condition = "AND orderTime BETWEEN "+date_start+" 00:00:01 AND "+date_to+" 23:59:59";
        }
        if(typeof req.body.date_start == 'undefined')
        {
            return res.status(422).json({
                status:422,
                message: "Please provide the date_start",
                data:[]
            });
        }
        if(typeof req.body.date_to == 'undefined')
        {
            return res.status(422).json({
                status:422,
                message: "Please provide the date_to",
                data:[]
            });
        }

        if (req.body.jwt.details.map(x => x.customerId).indexOf(shop_id) === -1) {

            return res.json({
                status: 500,
                message: "failed",
                data: "shop_id not found"
            });
        }

        if(offset == '' || offset == null)
            offset = 0;
        if(offset == 0 || offset == null)
            offset = 1;
        if(limit == '' || limit == null)
            limit = 10;
        const [row] = await conn.execute(
            "SELECT organizationId,warehouseId,orderNo,orderType,orderTime,customerId,consigneeName,consigneeAddress1,consigneeCity,consigneeProvince,consigneeTel1,consigneeContact,carrierName,noteText from DOC_ORDER_HEADER WHERE customerId=? AND orderTime BETWEEN ? AND ? limit ? offset ?",
            [
                shop_id,
                date_start,
                date_to,
                limit,
                offset
            ]
        );
        if(row.length > 0){
            return res.json({
                status:200,
                message:'success',
                response_time:durationInMilliseconds.toLocaleString()+" s",
                total_row:row.length,
                data:row
            });
        }

        res.json({
            status:401,
            message:"Order Not Found",
            response_time:durationInMilliseconds.toLocaleString()+" s",
            data:[]
        });
        
    }
    catch(err){
        next(err);
    }
}

exports.getDetailOrder = async (req,res,next) => {
    try {
        const orderno = [req.body.orderno];
        const shop_id = [req.body.shop_id];
        
        db_dev.query("SELECT organizationId,warehouseId,orderNo,orderType,orderTime,customerId,consigneeName,consigneeAddress1,consigneeCity,consigneeProvince,consigneeTel1,consigneeContact,carrierName,noteText from DOC_ORDER_HEADER WHERE customerId = ? AND orderNo = ?", [shop_id, orderno],function (err, oh, fields)
        {
            if(oh[0] == undefined)
            {
                return res.json({
                    status:401,
                    message:"Order Not Found",
                    response_time:durationInMilliseconds.toLocaleString()+" s",
                    data:[]
                });
            }
            var data = [];
            const header = {
                "organizationId"   : oh[0].organizationId,
                "warehouseId"      : oh[0].warehouseId,
                "orderNo"          : oh[0].orderNo,
                "orderType"        : oh[0].orderType,
                "orderTime"        : oh[0].orderTime,
                "customerId"       : oh[0].customerId,
                "consigneeName"    : oh[0].consigneeName,
                "consigneeAddress1": oh[0].consigneeAddress1,
                "consigneeCity"    : oh[0].consigneeCity,
                "consigneeProvince": oh[0].consigneeProvince,
                "consigneeTel1"    : oh[0].consigneeTel1,
                "consigneeContact" : oh[0].consigneeContact,
                "carrierName"      : oh[0].carrierName,
                "noteText"         : oh[0].noteText,
                "details"          : data
            };

            db_dev.query("SELECT warehouseId,organizationId,orderNo,sku,price,qtyOrdered FROM DOC_ORDER_DETAILS where orderNo = ?",[oh[0].orderNo],function (err, detail, fields)
            {
                const data = detail;
                const header = {
                    "organizationId"   : oh[0].organizationId,
                    "warehouseId"      : oh[0].warehouseId,
                    "orderNo"          : oh[0].orderNo,
                    "orderType"        : oh[0].orderType,
                    "orderTime"        : oh[0].orderTime,
                    "customerId"       : oh[0].customerId,
                    "consigneeName"    : oh[0].consigneeName,
                    "consigneeAddress1": oh[0].consigneeAddress1,
                    "consigneeCity"    : oh[0].consigneeCity,
                    "consigneeProvince": oh[0].consigneeProvince,
                    "consigneeTel1"    : oh[0].consigneeTel1,
                    "consigneeContact" : oh[0].consigneeContact,
                    "carrierName"      : oh[0].carrierName,
                    "noteText"         : oh[0].noteText,
                    "details"          : data
                };
                return res.json({
                    status:200,
                    message:'success',
                    response_time:durationInMilliseconds.toLocaleString()+" s",
                    data:header
                });
            });
        });        
    }
    catch(err){
        next(err);
    }
}