const jwt          = require('jsonwebtoken');
const conn         = require('../dbConnection').promise();
const crypto       = require('crypto');
const ECOM_API_KEY = 'xMXd9hNQCQ';
const axios        = require('axios');
const db_dev       = require('../dbConnection').db_dev;
const { param }    = require('express/lib/request');
const UAT          = 'https://pidgc-extoms.liveon.id';
const logger       = require('../logs');
const cron         = require('node-cron');

// const task = cron.schedule('1 * * * * *', function() 
// {
//     testJob().then();
// });

// async function testJob() {
//     let ts = Date.now();
//     console.log(ts);
// }


// ini udah bukan buat testing
exports.liveOnPo = async (req,res,next) => {
    function getToken(timestamp){
        return crypto.createHash('sha256').update(ECOM_API_KEY + timestamp).digest('hex').toUpperCase();
    }
    
    function getTimestamp(){
        return Date.now();
    }

    const pTimestamp = getTimestamp();
    const pToken     = getToken(pTimestamp);
    const [header]   = await conn.execute("SELECT h2.serialNo, h2.sku, h1.warehouseId,h1.orderNo, h1.soReference2,h1.orderType,h1.soStatus,h1.orderTime,h2.udf01  ,count(h2.orderNo) as count FROM DOC_ORDER_HEADER h1  join doc_order_serialno h2 on h1.orderNo = h2.orderNo where h1.organizationId='SF' and h1.sostatus IN ('62','63') and h1.ordertype IN ('N-RP','CM') and h2.udf01 is null and h1.customerId='INTREPID - LIVE ON' GROUP BY h2.orderNo having count(h2.orderNo) > 1 limit 1");
    if(header.length > 0)
    {
        const isi = [];
        var time_res;
        for (let index = 0; index < header.length; index++) 
        {
            const params   = header[index];
            const [serial] = await conn.execute("select * from DOC_ORDER_SERIALNO WHERE orderNo = ?",[params.orderNo]);
            if(serial.length > 0)
            {
                for (let ser = 0; ser < serial.length; ser++) 
                {
                    const bb    = serial[ser];
                    var code;
                    var date;
                    const [head] = await conn.execute("SELECT orderTime,soReference2 from DOC_ORDER_HEADER where orderNo = ?",[bb.orderNo]);
                    if(head.length > 0)
                    {
                        var code = head[0].soReference2;
                        var date = new Date(head[0].orderTime).toISOString().replace('T', ' ').substring(0, 19);
                    }
                    var price;
                    const [det] = await conn.execute("SELECT price from BAS_SKU where customerId = 'INTREPID - LIVE ON' and sku = ?",[bb.sku]);
                    if(det.length > 0)
                    {
                        var price = parseInt(det[0].price);
                    }
                    
                    const aa        = code+'-'+ser;
                    var   order_ref = aa.replace('-0' , '');
                    const data = {
                        "product_code" : bb.sku,
                        "order_ref"    : order_ref,
                        "amount"       : price,
                        "purchase_date": date,
                        "serial_number": bb.serialNo
                    };
                    let res1 = await axios({
                        url: UAT+'/api/v3/id/intrepid/purchase',
                        method: 'post',
                        headers: {
                            'P-Timestamp' : pTimestamp,
                            'P-Token'     : pToken,
                            'Content-Type': 'application/json'
                        },
                        data : data
                    });
                    const data1 = res1.data;
                    var time_res = res1.headers['x-runtime']+' ms'; 
                    // array_push(data1,time_res);
                    isi.push(data1);
                    console.log(data1);
                    if(data1.success === false)
                    {
                        // console.log(data1.error);
                        const [rows] = await conn.execute('UPDATE DOC_ORDER_SERIALNO set udf02=udf02+1,noteText=? where organizationId=? and warehouseId=? and orderNo=? and serialNo=?',[
                            data1.error,
                            bb.organizationId,
                            bb.warehouseId,
                            bb.orderNo,
                            bb.serialNo
                        ]);
                        if (rows.affectedRows === 1) {
                            console.log("success Update");
                        }
                        
                    }
                    else
                    {
                        console.log(serial);

                        const [rows] = await conn.execute('UPDATE DOC_ORDER_SERIALNO set udf01=1,udf02=1 where organizationId=? and warehouseId=? and orderNo=? and serialNo=?',[
                            data1.error,
                            bb.organizationId,
                            bb.warehouseId,
                            bb.orderNo,
                            bb.serialNo
                        ]);
                        if (rows.affectedRows === 1) {
                            console.log("success Update");
                        }
                    }
                }
            }
        }
        // conn.destroy();
        return res.json({
            status:200,
            message:'success',
            response_time:time_res+' ms',
            data:isi
        });
    }

}

exports.liveOnPoTest = async (req,res,next) => {
    function getToken(timestamp){
        return crypto.createHash('sha256').update(ECOM_API_KEY + timestamp).digest('hex').toUpperCase();
    }
    
    function getTimestamp(){
        return Date.now();
    }

    const pTimestamp = getTimestamp();
    const pToken     = getToken(pTimestamp);
    
    var data = JSON.stringify({
        "msisdn"       : req.body.msisdn,
        "product_code" : "CLMCPSHOP000023",
        "order_ref"    : req.body.order,
        "amount"       : 125000,
        "dompul_id"    : "8f78ef9e-5951-11ea-82b4-0242ac130003",
        "purchase_date": "2022-03-04 11:00:00"
    });
      
    var config = {
        method: 'post',
        url: 'https://qid-extoms.circles.life/api/v3/id/intrepid/purchase',
        headers: { 
            'P-Timestamp' : pTimestamp,
            'P-Token'     : pToken,
            'Content-Type': 'application/json'
        },
        data : data
    };
      
    axios(config).then(function (response) 
    {
        if(response.data.success != false)
        {
            return res.json({
                status:200,
                message:'Success',
                response_time:response.headers['x-runtime']+' ms',
                data:(response.data.result)
            });
        }
        else
        {
            return res.json({
                status:500,
                message:'Failed',
                response_time:response.headers['x-runtime']+' ms',
                data:(response.data.error)
            });
        }
    }).catch(function (error) 
    {
        res.json({
            status:401,
            message:error,
            data:[]
        });
    });
}

exports.liveOnPoStatus = async (req,res,next) => {
    function getToken(timestamp){
        return crypto.createHash('sha256').update(ECOM_API_KEY + timestamp).digest('hex').toUpperCase();
    }
    
    function getTimestamp(){
        return Date.now();
    }

    const pTimestamp = getTimestamp();
    const pToken     = getToken(pTimestamp);      
    var config = {
        method: 'get',
        url   : UAT+'/api/v3/id/intrepid/purchase/status?order_ref='+req.body.order_ref,
        headers: { 
            'P-Timestamp' : pTimestamp,
            'P-Token'     : pToken,
            'Content-Type': 'application/json'
        },
    };
      
    axios(config).then(function (response) {
        if(response.data.success != false)
        {
            return res.json({
                status:200,
                message:'success',
                response_time:response.headers['x-runtime']+' ms',
                data:(response.data.result)
            });
        }
        else
        {
            return res.json({
                status:500,
                message:'failed',
                response_time:response.headers['x-runtime']+' ms',
                data:(response.data.error)
            });
        }
    }).catch(function (error) {
        res.json({
            status:401,
            message:error,
            data:[]
        });
    });
}

exports.liveOnPoStatusTest = async (req,res,next) => {
    function getToken(timestamp){
        return crypto.createHash('sha256').update(ECOM_API_KEY + timestamp).digest('hex').toUpperCase();
    }
    
    function getTimestamp(){
        return Date.now();
    }

    const pTimestamp = getTimestamp();
    const pToken     = getToken(pTimestamp);
    // console.log(req.body.order_ref);
    var config = {
        method: 'get',
        url   : 'https://qid-extoms.circles.life/api/v3/id/intrepid/purchase/status?order_ref='+req.body.order_ref,
        headers: { 
            'P-Timestamp' : pTimestamp,
            'P-Token'     : pToken,
            'Content-Type': 'application/json'
        },
    };
      
    axios(config).then(function (response) {
        if(response.data.success != false)
        {
            return res.json({
                status:200,
                message:'success',
                response_time:response.headers['x-runtime']+' ms',
                data:(response.data.result)
            });
        }
        else
        {
            return res.json({
                status:500,
                message:'failed',
                response_time:response.headers['x-runtime']+' ms',
                data:(response.data.error)
            });
        }
    }).catch(function (error) {
        res.json({
            status:401,
            message:error,
            data:[]
        });
    });
}
// ini yang livenya
exports.liveOnPo1 = async(req,res,next) => {
    function getToken(timestamp){
        return crypto.createHash('sha256').update(ECOM_API_KEY + timestamp).digest('hex').toUpperCase();
    }
    
    function getTimestamp(){
        return Date.now();
    }

    const pTimestamp = getTimestamp();
    const pToken     = getToken(pTimestamp);
    const [header]   = await conn.execute("SELECT warehouseId,orderNo,orderType,soStatus,orderTime FROM DOC_ORDER_HEADER where organizationId='SF' and sostatus IN ('62','63') and ordertype IN ('N-RP','CM')");
    if(header.length > 0)
    {
        const isi = [];
        for (let index = 0; index < header.length; index++) {
            const params = header[index];
            var   date   = new Date(params.orderTime).toISOString().replace('T', ' ').substring(0, 19);

            const [details] = await conn.execute("SELECT itm.alternate_sku1, sn.warehouseId,sn.organizationId ,sn.serialNo, sn.udf01 as flag, dtl.orderNo, dtl.sku, dtl.price FROM DOC_ORDER_DETAILS dtl join DOC_ORDER_SERIALNO sn on dtl.orderNo = sn.orderNo join BAS_SKU itm on dtl.sku = itm.sku where dtl.orderNo = ? ", [params.orderNo]);
            for (let index = 0; index < details.length; index++) {
                const element      = details[index];
                var   amount       = element.price;
                var   msisdn       = element.serialNo;
                var   product_code = element.sku;
                var code;
                if(details.length > 1)
                {
                    var code = element.orderNo+"-"+index;
                }
                else
                {
                    var code = element.orderNo;
                }
                const data = {
                    "msisdn"       : msisdn,
                    "product_code" : product_code,
                    "order_ref"    : code,
                    "amount"       : amount,
                    "purchase_date": date
                };
                let res1 = await axios({
                    url: 'https://qid-extoms.circles.life/api/v3/id/intrepid/purchase',
                    method: 'post',
                    headers: {
                        'P-Timestamp' : pTimestamp,
                        'P-Token'     : pToken,
                        'Content-Type': 'application/json'
                    },
                    data : data
                });
                if(res1.data.success != false)
                {
                    // console.log("UPDATE DOC_ORDER_SERIALNO set udf01=1 where organizationId=? and warehouseId=? and orderNo=? and serialNo=?");
                    const [rows] = await conn.execute('UPDATE DOC_ORDER_SERIALNO set udf01=1,udf02=1 where organizationId=? and warehouseId=? and orderNo=? and serialNo=?',[
                        element.organizationId,
                        element.warehouseId,
                        element.orderNo,
                        element.serialNo
                    ]);
            
                    if (rows.affectedRows === 1) {
                        console.log("success Update");
                    }
                }
                else
                {
                    const [rows] = await conn.execute('UPDATE DOC_ORDER_SERIALNO set udf02=udf02+1 where organizationId=? and warehouseId=? and orderNo=? and serialNo=?',[
                        element.organizationId,
                        element.warehouseId,
                        element.orderNo,
                        element.serialNo
                    ]);
                    // console.log(element);
                    if (rows.affectedRows == 1) {
                        console.log("Failed update counter");
                    }
                }
                const data1 = res1.data;
                isi.push(data1);
            }
        };
        
        return res.json({
            status:200,
            message:'success',
            // response_time:response.headers['x-runtime']+' ms',
            data:isi
        });
    }
    else
    {
        return res.json({
            status:500,
            message:'Data not Found',
            data:[]
        });
    }
}

exports.liveOnPoRetry = async(req,res,next) => {
    function getToken(timestamp){
        return crypto.createHash('sha256').update(ECOM_API_KEY + timestamp).digest('hex').toUpperCase();
    }
    
    function getTimestamp(){
        return Date.now();
    }

    const pTimestamp = getTimestamp();
    const pToken     = getToken(pTimestamp);
    const [header]   = await conn.execute("SELECT warehouseId,orderNo,orderType,soStatus,orderTime FROM DOC_ORDER_HEADER where organizationId='SF' and sostatus IN ('62','63') and ordertype IN ('N-RP','CM')");
    if(header.length > 0)
    {
        const isi = [];
        for (let index = 0; index < header.length; index++) {
            const params = header[index];
            var   date   = new Date(params.orderTime).toISOString().replace('T', ' ').substring(0, 19);

            const [details] = await conn.execute("SELECT itm.alternate_sku1, sn.warehouseId,sn.organizationId ,sn.serialNo, sn.udf01 as flag, dtl.orderNo, dtl.sku, dtl.price FROM DOC_ORDER_DETAILS dtl join DOC_ORDER_SERIALNO sn on dtl.orderNo = sn.orderNo join BAS_SKU itm on dtl.sku = itm.sku where dtl.orderNo = ? AND sn.udf01 is null AND sn.udf02 < 3", [params.orderNo]);
            for (let index = 0; index < details.length; index++) {
                const element      = details[index];
                var   amount       = element.price;
                var   msisdn       = element.serialNo;
                var   product_code = element.sku;
                var code;
                if(details.length > 1)
                {
                    var code = element.orderNo+"-"+index;
                }
                else
                {
                    var code = element.orderNo;
                }
                const data = {
                    "msisdn"       : msisdn,
                    "product_code" : product_code,
                    "order_ref"    : code,
                    "amount"       : amount,
                    "purchase_date": date
                };
                let res1 = await axios({
                    url: 'https://qid-extoms.circles.life/api/v3/id/intrepid/purchase',
                    method: 'post',
                    headers: {
                        'P-Timestamp' : pTimestamp,
                        'P-Token'     : pToken,
                        'Content-Type': 'application/json'
                    },
                    data : data
                });
                if(res1.data.success != false)
                {
                    const [rows] = await conn.execute('UPDATE DOC_ORDER_SERIALNO set udf01=1,udf02=1 where organizationId=? and warehouseId=? and orderNo=? and serialNo=?',[
                        element.organizationId,
                        element.warehouseId,
                        element.orderNo,
                        element.serialNo
                    ]);
            
                    if (rows.affectedRows === 1) {
                        console.log("success Update");
                    }
                }
                else
                {
                    const [rows] = await conn.execute('UPDATE DOC_ORDER_SERIALNO set udf02=udf02+1 where organizationId=? and warehouseId=? and orderNo=? and serialNo=?',[
                        element.organizationId,
                        element.warehouseId,
                        element.orderNo,
                        element.serialNo
                    ]);
                    // console.log(element);
                    if (rows.affectedRows == 1) {
                        console.log("Failed update counter");
                    }
                }
                const data1 = res1.data;
                isi.push(data1);
            }
        };
        
        return res.json({
            status:200,
            message:'success',
            // response_time:response.headers['x-runtime']+' ms',
            data:isi
        });
    }
    else
    {
        return res.json({
            status:500,
            message:'Data not Found',
            data:[]
        });
    }
}

exports.liveOnPo_manual = async(req,res,next) => {
    function getToken(timestamp){
        return crypto.createHash('sha256').update(ECOM_API_KEY + timestamp).digest('hex').toUpperCase();
    }
    
    function getTimestamp(){
        return Date.now();
    }

    
    const pTimestamp = getTimestamp();
    const pToken     = getToken(pTimestamp);
    const data = {
        // "msisdn"       : req.body.msisdn,
        "product_code" : req.body.product_code,
        "order_ref"    : req.body.order_ref,
        "amount"       : req.body.amount,
        "purchase_date": req.body.purchase_date,
        "serial_number": req.body.serial_number
    };
    
    logger.info(req.path);
    logger.info(JSON.stringify(data));

    // return res.json({data});
    // let res1 = await axios({
    //     url: UAT+'/api/v3/id/intrepid/purchase',
    //     method: 'post',
    //     headers: {
    //         'P-Timestamp' : pTimestamp,
    //         'P-Token'     : pToken,
    //         'Content-Type': 'application/json'
    //     },
    //     data : data
    // });
    // return res.json({
    //     status   : 200,
    //     message  : 'Success',
    //     Timestamp: pTimestamp,
    //     Token    : pToken,
    //     data     : res1
    // });
    var config = {
        method: 'post',
        url: UAT+'/api/v3/id/intrepid/purchase',
        headers: { 
            'P-Timestamp' : pTimestamp,
            'P-Token'     : pToken,
            'Content-Type': 'application/json'
        },
        data : data
    };

    axios(config).then(function (response) {
        logger.info(JSON.stringify(response.data));
        if(response.data.success != false)
        {
            // logger.success("Success => " + response.data.success + " " + JSON.stringify(response.data.result));
            return res.json({
                status:200,
                message:'success',
                response_time:response.headers['x-runtime']+' ms',
                data:(response.data.result)
            });
        }
        else
        {
            // logger.error("Success => " + response.data.success + " " + JSON.stringify(response.data.error));
            return res.json({
                status:500,
                message:'failed',
                response_time:response.headers['x-runtime']+' ms',
                data:(response.data.error)
            });
        }
    }).catch(function (error) {
        res.json({
            status:401,
            message:error,
            data:[]
        });
    });
}

exports.liveOnPoStatus_manual = async (req,res,next) => {
    function getToken(timestamp){
        return crypto.createHash('sha256').update(ECOM_API_KEY + timestamp).digest('hex').toUpperCase();
    }
    
    function getTimestamp(){
        return Date.now();
    }

    const pTimestamp = getTimestamp();
    const pToken     = getToken(pTimestamp);
    // console.log(req.body.order_ref);
    var config = {
        method: 'get',
        url   : UAT+'/api/v3/id/intrepid/purchase/status?order_ref='+req.body.order_ref,
        headers: { 
            'P-Timestamp' : pTimestamp,
            'P-Token'     : pToken,
            'Content-Type': 'application/json'
        },
    };
      
    axios(config).then(function (response) {
        if(response.data.success != false)
        {
            return res.json({
                status:200,
                message:'success',
                response_time:response.headers['x-runtime']+' ms',
                data:(response.data.result)
            });
        }
        else
        {
            return res.json({
                status:500,
                message:'failed',
                response_time:response.headers['x-runtime']+' ms',
                data:(response.data.error)
            });
        }
    }).catch(function (error) {
        res.json({
            status:401,
            message:error,
            data:[]
        });
    });
}

// task.start();