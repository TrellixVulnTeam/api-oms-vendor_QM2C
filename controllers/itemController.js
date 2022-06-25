const jwt    = require('jsonwebtoken');
const conn   = require('../dbConnection').promise();
const conn_pg = require('../dbConnection_pg');
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

exports.getListItems = async (req,res,next)=>{
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
    const query='SELECT * FROM item where client_id = $1 and deleted=0 limit $2 offset $3';
    const value = [req.body.clientId, req.body.limit,req.body.offset];

    const row = await conn_pg.query(query,value);
    // await conn_pg.end();

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

exports.createItem = async (req, res, next) => {    
    const client = await conn_pg.connect();
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

        if(req.body.code==='undefine'||!req.body.code){
            return res.status(422).json({
                message: "Code shouldn't be empty"
            });
        }
        if(req.body.name==='undefine'||!req.body.name){
            return res.status(422).json({
                message: "Name shouldn't be empty"
            });
        }
        
        
        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken,'the-super-strong-secrect');

        const queryText = `INSERT INTO item("client_id", "item_managed_id", "code", 
        "name", "barcode", "description", "packing_intruction", "brand", "category", "model",
        "color", "size", "minimum_stock", "weight", "length", "height", "width", "additional_expired",
        "pictures", "bundling_kitting", "bundling_dynamic", "created_date", "created_by","modified_date", "modified_by", "client_code_temporary")
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21, to_char(now(), 'YYYY-MM-DD HH24:MM:SS')::TIMESTAMP,$22,to_char(now(), 'YYYY-MM-DD HH24:MM:SS')::TIMESTAMP,$23,$24) RETURNING item_id`;
        const values = [req.body.clientId,req.body.itemManagedId,req.body.code,req.body.name,
            req.body.barcode,req.body.descipton, req.body.packingInstruction, req.body.brand, req.body.category,req.body.model,
            req.body.color, req.body.size, req.body.minimumStock, req.body.weight, req.body.length, req.body.height, req.body.width, req.body.additionalExpired,
            req.body.pictures, req.body.bundlingKitting, req.body.bundlingDynamic, req.body.createdBy,req.body.modifiedBy, req.body.clientCodeTemporary];
        await client.query('BEGIN');
        const result = await client.query(queryText, values);
        await client.query('COMMIT');

        if (result.rowCount > 0){
            return res.json({
                status:200,
                message:'Success',
                response_time:durationInMilliseconds.toLocaleString() + " s",
                total_row:result.rowCount ,
                data:result.rows[0]
            });
        }

        
    res.json({
        status:500,
        message:'Failed',
        response_time:durationInMilliseconds.toLocaleString() + " s",
        data:[]
    });
    }
    catch(err){
        await client.query('ROLLBACK')
        return res.json({
            status:500,
            message:'Failed',
            response_time:durationInMilliseconds.toLocaleString() + " s",
            data:[]
        });
        // next(err);
    } finally {
        client.release()
      }
}


exports.deleteItem = async (req, res, next) => {    
    const client = await conn_pg.connect();
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

        if(req.body.itemId==='undefine'||!req.body.itemId){
            return res.status(422).json({
                message: "Item Id shouldn't be empty"
            });
        }        
        
        // const theToken = req.headers.authorization.split(' ')[1];
        // const decoded = jwt.verify(theToken,'the-super-strong-secrect');
        
        const query='SELECT * FROM item where item_id = $1';
        const value = [req.body.itemId];
        const row = await conn_pg.query(query,value);
        if(row.rowCount<=0){
            return res.json({
                status:500,
                message:'Item id not found',
                response_time:durationInMilliseconds.toLocaleString() + " s",
                data:[]
            });
        }
        const queryText = `UPDATE item set deleted=1 WHERE item_id = $1 RETURNING item_id`;
        const values = [req.body.itemId];
        await client.query('BEGIN');
        const result = await client.query(queryText, values);
        await client.query('COMMIT');

        if (result.rowCount > 0){
            return res.json({
                status:200,
                message:'Success',
                response_time:durationInMilliseconds.toLocaleString() + " s",
                total_row:result.rowCount ,
                data:req.body.itemId
            });
        }
        res.json({
            status:500,
            message:'Failed',
            response_time:durationInMilliseconds.toLocaleString() + " s",
            data:[]
        });
    }
    catch(err){
        await client.query('ROLLBACK')
        return res.json({
            status:500,
            message:'Failed',
            response_time:durationInMilliseconds.toLocaleString() + " s",
            data:[]
        });
        // next(err);
    } finally {
        client.release()
      }
}


exports.updateItem = async (req, res, next) => {    
    const client = await conn_pg.connect();
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

        if(req.body.itemId==='undefine'||!req.body.itemId){
            return res.status(422).json({
                message: "Item Id shouldn't be empty"
            });
        }        
        if(req.body.name==='undefine'||!req.body.name){
            return res.status(422).json({
                message: "name shouldn't be empty"
            });
        }  
        // const theToken = req.headers.authorization.split(' ')[1];
        // const decoded = jwt.verify(theToken,'the-super-strong-secrect');
        
        const querySelect='SELECT * FROM item where item_id = $1';        
        const queryUpdate = `UPDATE item set name=$1,description=$2 WHERE item_id = $3 RETURNING item_id,name,description`;
        const valueUpdate = [req.body.name,req.body.description,req.body.itemId];
        const valueSelect = [req.body.itemId];
        const row = await conn_pg.query(querySelect,valueSelect);
        if(row.rowCount<=0){
            return res.json({
                status:500,
                message:'Item not found',
                response_time:durationInMilliseconds.toLocaleString() + " s",
                data:[]
            });
        }

        await client.query('BEGIN');
        const result = await client.query(queryUpdate, valueUpdate);
        await client.query('COMMIT');

        if (result.rowCount > 0){
            return res.json({
                status:200,
                message:'Success',
                response_time:durationInMilliseconds.toLocaleString() + " s",
                total_row:result.rowCount ,
                data:result.rows
            });
        }
        res.json({
            status:500,
            message:'Failed',
            response_time:durationInMilliseconds.toLocaleString() + " s",
            data:[]
        });
    }
    catch(err){
        await client.query('ROLLBACK')
        return res.json({
            status:500,
            message:'Failed',
            response_time:durationInMilliseconds.toLocaleString() + " s",
            data:[]
        });
        // next(err);
    } finally {
        client.release()
      }
}