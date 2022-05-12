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

exports.getItems = async (req,res,next) => {
    try{

        if(
            !req.headers.authorization ||
            !req.headers.authorization.startsWith('Bearer') ||
            !req.headers.authorization.split(' ')[1]
        ){
            return res.status(422).json({
                message: "Please provide the token",
            });
        }

        const theToken   = req.headers.authorization.split(' ')[1];
        const decoded    = jwt.verify(theToken, 'the-super-strong-secrect');
        const offset     = Number([req.body.offset]);
        const limit      = Number([req.body.limit]);

        if(offset == '' || offset == null)
            offset = 0;
        if(offset == 0 || offset == null)
            offset = 1;
        if(limit == '' || limit == null)
            limit = 10;

        const [row] = await conn.execute(
            "SELECT organizationId,customerId,sku,skuDescr1,grossWeight,netWeight,skuLength,skuWidth,skuHigh,lastCycleCount from BAS_SKU WHERE customerId = ? limit ? offset ?",
            [
                decoded.customerid,
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

exports.getDetailItem = async (req,res,next) => {
    try{

        if(
            !req.headers.authorization ||
            !req.headers.authorization.startsWith('Bearer') ||
            !req.headers.authorization.split(' ')[1]
        ){
            return res.status(422).json({
                message: "Please provide the token",
            });
        }

        const theToken   = req.headers.authorization.split(' ')[1];
        const decoded    = jwt.verify(theToken, 'the-super-strong-secrect');
        
        const [row] = await conn.execute(
            "SELECT organizationId,customerId,sku,skuDescr1,grossWeight,netWeight,skuLength,skuWidth,skuHigh,lastCycleCount from BAS_SKU WHERE customerId = ? AND sku = ?",
            [
                decoded.customerid,
                req.body.sku
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