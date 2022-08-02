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
    const value = [req.body.clientId, req.body.limit, req.body.offset];

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
    const regex=/^[A-Za-z0-9\/\.\-]+$/;
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
        if(!regex.test(req.body.code)){
            res.status(400).send("SKU can only contain alphanumeric, (.), (-), and (/)!");
        }

        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken,'the-super-strong-secrect');

        //check duplicate SKU on seller
        const query='SELECT * FROM item where client_id = $1 and code = $2';
        const value = [req.body.clientId,req.body.code];
        const row = await conn_pg.query(query,value);
        if(row.rowCount>0){
            return res.json({
                status:500,
                message:'SKU duplicated!',
                response_time:durationInMilliseconds.toLocaleString() + " s",
                data:[]
            });
        }

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


exports.activateItem = async (req, res, next) => {    
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

        if(req.body.itemId==='undefine'||!req.body.itemId){
            return res.status(422).json({
                message: "Item Id shouldn't be empty"
            });
        }        
        
        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken,'the-super-strong-secrect');
        
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
        const actv = req.body.active?1:0;
        const delt = req.body.active?0:1;
        const queryText = `UPDATE item set deleted=$1,active=$2 WHERE item_id = $3 RETURNING item_id`;
        const values = [delt, actv, req.body.itemId];
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
        //  next(err);
    } finally {
        client.release()
      }
}


exports.updateItem = async (req, res, next) => {    
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
        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken,'the-super-strong-secrect');
        
        const querySelect='SELECT it.item_id as a,od.item_id as b FROM item it left join orderdetail od on it.item_id=od.item_id where it.item_id = $1';        
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
        }else
        if(row.rows[0]['a'] && row.rows[0]['b']){
            return res.json({
                status:500,
                message:'Item already on transaction',
                response_time:durationInMilliseconds.toLocaleString() + " s",
                data:[]
            });
        }

        //check duplicate SKU on seller
        const query='SELECT * FROM item where client_id = $1 and code = $2 and item_id != $3';
        const value = [req.body.clientId, req.body.code, req.body.itemId];
        const rowDuplicate = await conn_pg.query(query,value);
        if(rowDuplicate.rowCount>0){
            return res.json({
                status:500,
                message:'SKU duplicated!',
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
        //  next(err);
    } finally {
        client.release()
      }
}

 exports.uploadItem = async (req, res, next) => { 
    const regex=/^[A-Za-z0-9\/\.\-]+$/;
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

        if (req.file == undefined) {
            return res.status(400).send("Please upload a CSV file!");
          }       
        
        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken,'the-super-strong-secrect');

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
            const queryText = `INSERT INTO item("client_id", "item_managed_id", "code", 
            "name", "barcode", "description", "packing_intruction", "brand", "category", "model",
            "color", "size", "minimum_stock", "weight", "length", "height", "width", "additional_expired",
            "pictures", "bundling_kitting", "bundling_dynamic", "created_date", "created_by","modified_date", "modified_by", "client_code_temporary")
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21, to_char(now(), 'YYYY-MM-DD HH24:MM:SS')::TIMESTAMP,$22,to_char(now(), 'YYYY-MM-DD HH24:MM:SS')::TIMESTAMP,$23,$24) RETURNING item_id`;

            for (const row of csvRowArray) {
                const client =  await conn_pg.connect();   
                let message='';

                if(!regex.test(row['code'])){
                    message="Failed-SKU format incorrect";
                    row_insert.push(Object.assign({},row,{insert:message}));
                    continue;
                }

                //check duplicate SKU on seller
                const query='SELECT * FROM item where client_id = $1 and code = $2';
                const value = [row['client_id'], row['code']];
                const rowCheck = await conn_pg.query(query,value);
                if(rowCheck.rowCount>0){
                    message='Failed-SKU already used';
                    row_insert.push(Object.assign({},row,{insert:message}));
                    continue;
                }

                const values = [parseInt(row['client_id']), (row['item_managed_id']?parseInt(row['item_managed_id']):null),row['code'], row['name'],
                row['barcode'],row['description'], row['packing_intruction'], row['brand'], row['category'],row['model'],
                row['color'], row['size'], parseInt(row['minimum_stock']), row['weight'], row['length'], row['height'], row['width'], row['additional_expired'],
                row['pictures'], parseInt(row['bundling_kitting']), parseInt(row['bundling_dynamic']), row['created_by'],row['created_by'], row['client_code_temporary']];

                try {
                    await client.query('BEGIN');
                    const result = await client.query(queryText, values);
                    await client.query('COMMIT');

                    if (result.rowCount > 0){
                        row_insert.push(Object.assign({},row,result.rows[0],{insert:'success'}));
                    }
                }
                catch(err){
                await client.query('ROLLBACK');
                    return res.json({
                        status:500,
                        message:'Error Insert data to database',
                        response_time:durationInMilliseconds.toLocaleString() + " s",
                        data:[]
                    });
                }
                finally {
                    client.release();
                }
            }

            if (row_insert.length > 0){
                return res.json({
                    status:200,
                    message:'Success',
                    response_time:durationInMilliseconds.toLocaleString() + " s",
                    total_row:row_insert.length ,
                    data:row_insert
                });
            }else{
                res.json({
                    status:500,
                    message:'Failed',
                    response_time:durationInMilliseconds.toLocaleString() + " s",
                    data:[]
                })
            }
        });        
    }
    catch(err){
        return res.json({
            status:500,
            message:'Failed upload file',
            response_time:durationInMilliseconds.toLocaleString() + " s",
            data:[]
        });
        // next(err);
    }
}