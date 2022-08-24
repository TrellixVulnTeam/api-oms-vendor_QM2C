const jwt    = require('jsonwebtoken');
const conn   = require('../dbConnection').promise();
const conn_pg = require('../dbConnection_pg');
const crypto = require('crypto');
const db_dev = require('../dbConnection');
const fs = require("fs");
const fast_csv = require("fast-csv");
const { error } = require('console');
const  {Readable} = require('stream');

const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}
const start = process.hrtime()
const durationInMilliseconds = getDurationInMilliseconds (start)

exports.getListInventory = async (req,res,next)=>{
try{
    if(
        !req.headers.authorization||
        !req.headers.authorization.startsWith('Bearer')||
        !req.headers.authorization.split(' ')[1]
    ){
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
    
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken,'the-super-strong-secrect');
    const query='SELECT * FROM inventory limit $1 offset $2';
    const value = [req.body.limit, req.body.offset];

    const row = await conn_pg.query(query,value);

    if (row.rowCount > 0){
        return res.json({
            status:200,
            message:'Success',
            response_time:durationInMilliseconds.toLocaleString() + " s",
            total_row:row.rowCount ,
            data:row.rows
        });
    }

    res.json({
        status:404,
        message:'Item Not Found',
        response_time:durationInMilliseconds.toLocaleString() + " s",
        data:[]
    });

}
catch(err){next(err);}
}

exports.getDetailInventory = async (req,res,next)=>{
    try{
        if(
            !req.headers.authorization||
            !req.headers.authorization.startsWith('Bearer')||
            !req.headers.authorization.split(' ')[1]
        ){
            return res.status(422).json({
                message: "Please provide the token",
            });
        }
        
        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken,'the-super-strong-secrect');
        const query='SELECT * FROM inventory where inventory_id = $1 limit $2 offset $3';
        const value = [req.body.inventoryId, req.body.limit, req.body.offset];
    
        const row = await conn_pg.query(query,value);
    
        if (row.rowCount > 0){
            return res.json({
                status:200,
                message:'Success',
                response_time:durationInMilliseconds.toLocaleString() + " s",
                total_row:row.rowCount ,
                data:row.rows
            });
        }
    
        res.json({
            status:404,
            message:'Item Not Found',
            response_time:durationInMilliseconds.toLocaleString() + " s",
            data:[]
        });
    
    }
    catch(err){next(err);}
}


exports.getDetailByProduct = async (req,res,next)=>{
    try{
        if(
            !req.headers.authorization||
            !req.headers.authorization.startsWith('Bearer')||
            !req.headers.authorization.split(' ')[1]
        ){
            return res.status(422).json({
                message: "Please provide the token",
            });
        }
        
        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken,'the-super-strong-secrect');
        const query='SELECT * FROM inventory where item_id = $1 limit $2 offset $3';
        const value = [req.body.productId, req.body.limit, req.body.offset];
    
        const row = await conn_pg.query(query,value);
    
        if (row.rowCount > 0){
            return res.json({
                status:200,
                message:'Success',
                response_time:durationInMilliseconds.toLocaleString() + " s",
                total_row:row.rowCount ,
                data:row.rows
            });
        }
    
        res.json({
            status:404,
            message:'Item Not Found',
            response_time:durationInMilliseconds.toLocaleString() + " s",
            data:[]
        });
    
    }
    catch(err){next(err);}
}
