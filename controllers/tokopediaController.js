const jwt        = require('jsonwebtoken');
const conn       = require('../dbConnection').promise();
const axios      = require('axios');
const { param }  = require('express/lib/request');
const logger     = require('../logs');
const cron       = require('node-cron');
const nodeBase64 = require('nodejs-base64-converter');
const conn_pg    = require('../dbConnection_pg');
const moment = require('moment');
const fs             = require('fs');
const decryptContent = require('tokopedia-decrypt-node');

async function generateToken (req,res,next) 
{
    const config = await conn_pg.query("SELECT * FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id=shop.client_id LEFT JOIN channel ch ON shop.channel_id=ch.channel_id WHERE ch.name='TOKOPEDIA' and shop.active=1");
    if(config.rowCount == 0)
    {
        res.json({
            status: false,
            message: "Shop not found"
        });
    }
    else
    {
        config.rows.forEach(async function(configs) {
            const token = nodeBase64.encode(configs.client_code+":"+configs.client_secret);
            var config = {
                method: 'post',
                url   : 'https://accounts.tokopedia.com/token?grant_type=client_credentials',
                headers: { 
                    'Authorization' : 'Basic '+token,
                    'User-Agent'    : 'PostmanRuntime/7.17.1',
                    'Content-Length': '0',
                }
            };
            axios(config)
            .then(async (response)=> 
            {
                if(response.status == 200)
                {
                    var remainingExpireInDay = response.data.expires_in / 86400;
                    var date = new Date();
                    date.getDate(date.setDate(date.getDate() + remainingExpireInDay));
                    const expiresIn = moment(date).format("YYYY-MM-DD HH:mm:ss");
                    // console.log(expiresIn)
                    let update = await conn_pg.query("UPDATE shopconfiguration SET token = $1, expires_in = $2, generate_in = NOW(), modified_date = NOW() WHERE shop_configuration_id = $3", [response.data.access_token,expiresIn,configs.shop_configuration_id]);
                    if(update.rowCount > 0)
                    {
                        res.json({
                            status : 200,
                            message: "OK",
                            data   : "TOKOPEDIA AUTH - SUCCESSFULLY GENERATE TOKEN FOR THIS SHOP "+configs.shop_name
                        });
                    }
                    else
                    {
                        res.json({
                            status : 500,
                            message: "FAILED",
                            data   : "TOKOPEDIA AUTH - FAILED TO GET TOKEN FOR THIS SHOP "+configs.shop_name
                        });
                    }
                }
                else
                {
                    res.json({
                        status : false,
                        message: "failed",
                        data   : response.data
                    });
                }
            })
            .catch(function (error) 
            {
                console.log(error)
                // res.json({
                //     status : false,
                //     message: "failed",
                //     data   : "Server error"
                // });
            });
        });
    }
}

async function test(req,res,next)
{
    const date = moment().format("YYYY-MM-DD HH:mm:ss");

    // let callStore = await dataTest();
    console.log(date)
    // if(callStore.status = 200)
    // {
    //     res.json({
    //         status:200,
    //         data: "ok"
    //     });
    // }
    // else{        
    //     res.json({
    //         status:500,
    //         data: "not"
    //     })
    // }
}

async function shopInfo(req,res,next)
{
    try
    {
        const config = await conn_pg.query("select shp.token,shp.shop_configuration_id,shp.shop_id,shp.shop_name,shp.fs_id,shp.client_code,shp.client_secret from shopconfiguration shp join channel ch on shp.channel_id = ch.channel_id where ch.name='TOKOPEDIA' and shp.active='1'");
        if(config.rowCount == 0)
        {
            res.json({
                status : false,
                message: "Shop not found"
            });
        }
        else
        {
            config.rows.forEach(configs => {
                var config = {
                    method: 'get',
                    url   : 'https://fs.tokopedia.net/v1/shop/fs/14887/shop-info',
                    headers: { 
                      'Authorization' : 'Bearer '+configs.token,
                    }
                };       
                axios(config).then(function (response) {
                    if(response.status == 200)
                    {
                        res.json({
                            status : 200,
                            message: "success",
                            data   : response.data
                        });
                    }
                    else
                    {
                        res.json({
                            status : false,
                            message: "failed",
                            data   : response.data
                        });
                    }
                }).catch(function (error) {
                    res.json({
                        status : false,
                        message: "failed",
                        data   : "Server error"
                    });
                });
            });
        }
    }
    catch(error)
    {
        res.json({
            status : false,
            message: "failed",
            data   : "Server error"
        });
    }
}

async function getOrder(req,res,next)
{
    var messageError = {};
    var messageSuccess = {};
    try 
    {
        const isi = [];
        const isu = [];
        const sql = await conn_pg.query("SELECT * FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id=shop.client_id LEFT JOIN channel ch ON shop.channel_id=ch.channel_id WHERE ch.name='TOKOPEDIA' and shop.get_order=1 and shop.active=1 and shop.shop_id <> ''");
        // const sql = await conn_pg.query("SELECT * FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id=shop.client_id LEFT JOIN channel ch ON shop.channel_id=ch.channel_id WHERE ch.name='TOKOPEDIA'");
        if(sql.rowCount == 0)
        {
            res.json({
                status: false,
                message: "Shop not found"
            });
        }
        else
        {
            const program = sql.rows[0];
            var shopName = program.shop_name;
            var i = 1;
            var unix = moment().unix();
            const fromDate = moment(unix) - (3600*24);
            const toDate = moment(unix) + (3600*7);
            // console.log(program)
            for(i; i <= 10; i++)
            {
                var config = {
                    method: 'GET',
                    // url   : 'https://fs.tokopedia.net/v2/order/list?fs_id='+program.fs_id+'&from_date='+fromDate+'&to_date='+toDate+'&page='+i+'&per_page=5&warehouse_id=9767451&status=220',
                    url   : 'https://fs.tokopedia.net/v2/order/list?fs_id='+program.fs_id+'&from_date='+fromDate+'&to_date='+toDate+'&page='+i+'&per_page=5&warehouse_id=9767451',
                    headers: { 
                        'Content-type' : 'application/json',
                        'Content-Length': '0',
                        'Authorization': 'Bearer '+program.token
                    }
                };
                axios(config)
                .then(async (response)=> {
                    // console.log(response.data.data)
                    if((typeof response.data === 'object') && response.data != "" && response.data.data != null)
                    {
                        // console.log(response.data.data)
                        for(const orders of response.data.data)
                        {
                            let isInOrders = await checkOrderCode(orders.invoice_ref_num,program.client_id); 
                            if(!isInOrders)
                            {
                                var notes = "";
                                var items = {};
                                var total_price       = orders.amt.ttl_amount;
                                var discount          = orders.promo_order_detail.total_discount_product;
                                var discountShipping = orders.promo_order_detail.total_discount_shipping;
                                var totalProductPrice = (typeof orders.amt.ttl_product_price === 'object') ? orders.amt.ttl_product_price : 0;
                                var shippingPrice     = orders.amt.shipping_cost;
                                var stockType         = 'MULTI CHANNEL';
                                var stockSource       = "GOOD STOCK";
                                for(const item of orders.products)
                                {
                                    let res_mapping = await checkMappingItemId(item.id,program.shop_configuration_id);
                                    if(res_mapping)
                                    {
                                        if(res_mapping.item_id == "")
                                        {
                                            messageError = {
                                                status : 500,
                                                message : program.shop_name+" - FAILED CREATE ORDER "+orders.invoice_ref_num,
                                                data : "ORDER "+orders.invoice_ref_num+" ALREADY EXIST IN EOS"
                                            };
                                            // console.log(messageError); 
                                            isi.push(messageError);
                                        }
                                        else{
                                            items = {
                                                item_id     : item.id,
                                                item_code   : res_mapping.item_id,
                                                quantity    : item.quantity,
                                                item_weight : item.weight,
                                                unit_price  : item.price,
                                                remark	    : item.notes
                                            } 
                                            notes = item.notes+",";
                                        } 
                                    }
                                    else{
                                        var sku = (item.sku == "") ? item.id : item.sku.toUpperCase();
                                        // console.log(sku)   
                                        let resMapping = await checkMappingItemCode(sku,program.shop_configuration_id);
                                        if(resMapping)
                                        {
                                            if(resMapping.item_id == "")
                                            {
                                                messageError = {
                                                    status : 500,
                                                    message : program.shop_name+" - FAILED CREATE ORDER "+orders.invoice_ref_num,
                                                    data : "ORDER "+orders.invoice_ref_num+" ALREADY EXIST IN EOS"
                                                };
                                                // console.log(messageError);
                                                isi.push(messageError); 
                                            }
                                            else{
                                                items = {
                                                    item_id     : item.id,
                                                    item_code   : resMapping.item_id,
                                                    quantity    : item.quantity,
                                                    item_weight : item.weight,
                                                    unit_price  : item.price,
                                                    remark	    : item.notes
                                                } 
												notes = item.notes+",";
                                            }
                                        }
                                        else{
                                            messageError = {
                                                status : 500,
                                                message : program.shop_name+" - FAILED CREATE ORDER "+orders.invoice_ref_num,
                                                data : "ITEM "+sku+" NOT YET MAPPING"
                                            };
                                            isi.push(messageError);
                                            // console.log(messageError); 
                                        }
                                    }

                                }
                                // console.log(items); 

                                if(items === "")
                                {
                                    var shipping = orders.logistics.shipping_agency;
                                    let isCourierMapped = await findCourier(shipping, orders.logistics.service_type); 
                                    if(typeof isCourierMapped === 'object')
                                    {
                                        var geo       = (orders.logistics.geo != "") ? orders.logistics.geo.split(",") : "";
                                        var latitude  = (geo != "") ? geo[0] : 0;
                                        var longitude = (geo != "") ? geo[1] : 0;
                                        
                                        // console.log(isCourierMapped)
                                        let checkMappingLocations = await checkShopLocation(orders.warehouse_id,program.shop_configuration_id);
                                        if(typeof checkMappingLocations === 'object')   
                                        {
                                            var config = {
                                                method: 'GET',
                                                url   : 'https://fs.tokopedia.net/v1/fs/'+program.fs_id+'/fulfillment_order?order_id='+orders.order_id,
                                                headers: { 
                                                    'Content-type' : 'application/json',
                                                    'Content-Length': '0',
                                                    'Authorization': 'Bearer '+program.token
                                                }
                                            };
                                            axios(config)
                                            .then(async (cods)=> {
                                                if(typeof cods.data.data.order_data[0] === 'object')
                                                {
                                                    var date      = orders.create_time + (3600*7);
                                                    var dates     = new Date(date);
                                                    let month     = await setMonth(dates.getMonth());
                                                    var timeStamp = dates.getFullYear()+"-"+month+"-"+dates.getDate()+" "+dates.getHours()+":"+dates.getMinutes()+":"+dates.getSeconds();
                                                    var cod       = (cods.data.data.order_data[0].order.payment_amt_cod == 0) ? "NON COD" : "COD";
                                                    var codPrice = (cod == "COD") ? cods.data.data.order_data[0].order.payment_amt_cod : 0;
                                                    var paymentId = (cod == "COD") ?  1 : 2;
                                                    var bookingNumber = null;
                                                    var waybillNumber = null;
                                                    var orderTypeId = 1;
                                                    let decryptOrder = await decryptTokped(orders);
                                                    decryptOrder.recipient.address.district = orders.recipient.address.district; 
                                                    decryptOrder.recipient.address.city = orders.recipient.address.city; 
                                                    decryptOrder.recipient.address.province = orders.recipient.address.province; 
                                                    decryptOrder.recipient.address.country = orders.recipient.address.country; 
                                                    decryptOrder.recipient.address.postal_code = orders.recipient.address.postal_code;
                                                    // console.log(timeStamp)
                                                    let isStockTypes = await checkStockType(program.client_id,stockType);
                                                    if(typeof isStockTypes === 'object'){
                                                        // console.log(decryptOrder);
                                                        let callStore = await storeOrders(orders.invoice_ref_num, program.client_id, program.channel_id, program.shop_configuration_id, isStockTypes.stock_type_id, orderTypeId, isCourierMapped.delivery_type_id, checkMappingLocations.locationid, orders.order_id, bookingNumber, waybillNumber, total_price, decryptOrder, timeStamp, totalProductPrice, discount, shippingPrice, discountShipping, paymentId, codPrice, notes, shopName, stockSource, latitude, longitude, items);
                                                        // if(callStore)
                                                        // { 
                                                        //     messageSuccess = {
                                                        //         status : 200,
                                                        //         message : "Success Create Order",
                                                        //         detail : {
                                                        //             data : "GET ORDERS - Order code "+orderCode+" has created header and detail successfully"
                                                        //         }
                                                        //     };
                                                        //     console.log(messageSuccess);
                                                        //     // res.json(messageSuccess);
                                                        // }
                                                        // else{
                                                        //     messageError = {
                                                        //         status : 500,
                                                        //         message : "Failed Create Order",
                                                        //         detail : {
                                                        //             data : "GET ORDERS - Order code "+orderCode+" has created header and detail failed"
                                                        //         }
                                                        //     };
                                                        //     console.log(messageError);
                                                        //     // res.json(messageError);
                                                        // }
                                                    }
                                                    else{
                                                        messageError = {
                                                            shop_configuration_id : shopConfigId,
                                                            shop_name : shopName,
                                                            success : false,
                                                            message : "GET ORDERS - Stock Type "+stockType+" Not Mapping"
                                                        };
                                                        console.log(messageError);
                                                    }
                                                }
                                            })
                                            .catch(function (error) {
                                                console.log(error.response)
                                            });
                                            
                                        }
                                        else
                                        {
                                            messageError = {
                                                data   : "GET ORDERS - OrderCode "+orders.invoice_ref_num+" Failed To Create Because, ShopLocation "+orders.warehouse_id+" Not Found In Mapping ShopLocation"
                                            }
                                            
                                            // let logapi = await conn_pg.query("INSERT INTO logapi(client_id, shop_configuration_id, order_code, item_code, result, created_date, params) VALUES ($1, $2, $3, $4, $5, $6, $7)",[rest.client_id, rest.shop_configuration_id, orderCode, salesOrderId, JSON.stringify(messageError), date, locationIdJubelio]);
                                            // res.json(messageError);
                                            // isi.push(messageError);
                                            console.log(messageError)
                                        }
                                    } 
                                    else{
                                        messageError = {
                                                data : "GET ORDERS - OrderCode "+orders.invoice_ref_num+" Failed To Create Because, Courier "+shipping+" Not Found In Mapping Courier"
                                        };

                                        // let logapi = await conn_pg.query("INSERT INTO logapi(client_id, shop_configuration_id, order_code, item_code, result, created_date) VALUES ($1, $2, $3, $4, $5, $6)",[rest.client_id, rest.shop_configuration_id, orderCode, courier, JSON.stringify(messageError), date]);
                                        
                                        console.log(messageError) 
                                        // isi.push(messageError);
                                    }
                                }
                            }
                            else{  
                                messageError = {
                                    status : 500,
                                    message : program.shop_name+" - FAILED CREATE ORDER "+orders.invoice_ref_num,
                                    data : "ORDER "+orders.invoice_ref_num+" ALREADY EXIST IN EOS"
                                };
                                isi.push(messageError);
                                // console.log(messageError);                                
                            }                             
                        };
                    }
                    else{
                        messageError = {
                            message: response.data.header.messages,
                            data   : response.data.header.reason
                        };
                        isi.push(messageError);
                        // console.log(messageError)
                    }
                    res.json({
                        status:500,
                        messasge:"Failed",
                        data:isi
                    });
                    // console.log(isi)
                })
                .catch(function (error) {
                    // messageError = {
                    //     status : error.response.header.error_code,
                    //     message: error.response.header.messages,
                    //     data   : error.response.header.reason
                    // };
                    console.log(error.response)
                });
            }
                        
            // res.json({
            //     status:200,
            //     messasge:"Success",
            //     data:isu
            // });
        }
    } catch (error) {
        res.json({
            status : false,
            message: "failed",
            data   : "Server error"
        });
    }
}

/*async function getProduct(req,res,next)
{
    var messageError = {};
    var messageSuccess = {};
    const isi = [];
    const isu = [];
    try 
    {
        const config = await conn_pg.query("select shp.client_id,shp.token,shp.shop_configuration_id,shp.shop_id,shp.shop_name,shp.fs_id,shp.client_code,shp.client_secret from shopconfiguration shp join channel ch on shp.channel_id = ch.channel_id where ch.name='TOKOPEDIA' and shp.active='1' and shp.sync_product='1'");
        if(config.rowCount == 0)
        {
            res.json({
                status: false,
                message: "Shop not found"
            });
        }
        else
        {
            config.rows.forEach(configs => {
                // var i = 1; 
                // for(var i = 1; i < 10 ; i++)
                // {
                    var config = {
                        method: 'GET',
                        url   : 'https://fs.tokopedia.net/inventory/v1/fs/'+configs.fs_id+'/product/info?shop_id='+configs.shop_id+'&page=1&per_page=10&sort=7',
                        headers: { 
                            'Content-type' : 'application/json',
                            'Content-Length': '0',
                            'Authorization': 'Bearer '+configs.token
                        },
                        validateStatus: () => true
                    };
                    axios(config)
                    .then(async (response)=> {
                        // console.log(response)
                        if(response.status == 200)
                        {
                            // console.log(response.data)
                            for(const data of response.data.data)
                            {
                                let result_mapping = await conn_pg.query("SELECT mapping_item, item_id, product_code as sku FROM mappingitem WHERE shop_configuration_id = $1 AND product_id = $2", [configs.shop_configuration_id,data.basic.productID]);
                                var getMappingItem = result_mapping.rows[0];
                                // console.log(checkMappingItems)
                                if(result_mapping.rowCount > 0)
                                {
                                    if(typeof data.other.sku === 'object' && data.other.sku != "" && data.other.sku != "-"){
                                        if(getMappingItem.sku != data.other.sku)
                                        {
                                            let stmt_getItem = await conn_pg.query("SELECT item_id FROM item WHERE client_id = $1 AND code = $2", [configs.client_id,data.other.sku]);
                                            var getItem = stmt_getItem.rows[0];
                                            if(stmt_getItem.rowCount > 0)
                                            {
                                                if(getItem.item_id != getMappingItem.item_id)
                                                {
                                                    let stmt_updateMappingItem = await conn_pg.query("UPDATE mappingitem SET product_code = $1, item_id = $2, product_url = $3, modified_date = NOW(), product_name = $4 WHERE mapping_item = $5", [data.other.sku, getItem.item_id, data.other.url, data.basic.name.replace("'", ""), getMappingItem.mapping_item]);
                                                    if(stmt_updateMappingItem.rowCount > 0)
                                                    {
                                                        messageSuccess = {
                                                            shop_id    : data.basic.shopID,
                                                            product_id : data.basic.productID,
                                                            sku        : data.other.sku,
                                                            names      : data.basic.name.replace("'", ""),
                                                            message    : "SUCCESS: UPDATE BINDING ITEM",
                                                        };
                                                        isu.push(messageSuccess);
                                                    }
                                                    else
                                                    {
                                                        messageError = {
                                                            shop_id    : data.basic.shopID,
                                                            product_id : data.basic.productID,
                                                            sku        : data.other.sku,
                                                            names      : data.basic.name.replace("'", ""),
                                                            message    : "FAILED: UPDATE BINDING ITEM",
                                                        };
                                                        isi.push(messageError);
                                                    }
                                                }
                                                else{
                                                    let stmt_updateMappingItem = await conn_pg.query("UPDATE mappingitem SET product_code = $1, product_url = $2, modified_date = NOW(), product_name = $3 WHERE mapping_item = $4", [data.other.sku, data.other.url, data.basic.name.replace("'", ""), getMappingItem.mapping_item]);
                                                    if(stmt_updateMappingItem.rowCount > 0)
                                                    {
                                                        messageSuccess = {
                                                            shop_id    : data.basic.shopID,
                                                            product_id : data.basic.productID,
                                                            sku        : data.other.sku,
                                                            names      : data.basic.name.replace("'", ""),
                                                            message    : "SUCCESS: UPDATE SKU CODE WITHOUT UPDATE BIND TO ITEM MASTER",
                                                        };
                                                        isu.push(messageSuccess);
                                                    }
                                                    else
                                                    {
                                                        messageError = {
                                                            shop_id    : data.basic.shopID,
                                                            product_id : data.basic.productID,
                                                            sku        : data.other.sku,
                                                            names      : data.basic.name.replace("'", ""),
                                                            message    : "FAILED: UPDATE SKU CODE WITHOUT UPDATE BIND TO ITEM MASTER",
                                                        };
                                                        isi.push(messageError);
                                                    }
                                                }
                                            }
                                            else{
                                                let stmt_updateMappingItem = await conn_pg.query("UPDATE mappingitem SET product_code = $1, product_url = $2, modified_date = NOW(), product_name = $3 WHERE mapping_item = $4", [data.other.sku, data.other.url, data.basic.name.replace("'", ""), getMappingItem.mapping_item]);
                                                if(stmt_updateMappingItem.rowCount > 0)
                                                {
                                                    messageSuccess = {
                                                        shop_id    : data.basic.shopID,
                                                        product_id : data.basic.productID,
                                                        sku        : data.other.sku,
                                                        names      : data.basic.name.replace("'", ""),
                                                        message    : "SUCCESS: UPDATE SKU CODE ONLY",
                                                    };
                                                    isu.push(messageSuccess);
                                                }
                                                else
                                                {
                                                    messageError = {
                                                        shop_id    : data.basic.shopID,
                                                        product_id : data.basic.productID,
                                                        sku        : data.other.sku,
                                                        names      : data.basic.name.replace("'", ""),
                                                        message    : "FAILED: UPDATE SKU CODE ONLY",
                                                    };
                                                    isi.push(messageError);
                                                }
                                            }
                                        }
                                        else{
                                            if(getMappingItem.item_id === null)
                                            {
                                                let stmt_getItem = await conn_pg.query("SELECT item_id FROM item WHERE client_id = $1 AND code = $2", [configs.client_id,data.other.sku]);
                                                var getItem = stmt_getItem.rows[0];
                                                if(stmt_getItem.rowCount > 0)
                                                {
                                                    if(getItem.item_id != getMappingItem.item_id)
                                                    {
                                                        let stmt_updateMappingItem = await conn_pg.query("UPDATE mappingitem SET product_code = $1, item_id = $2, product_url = $3, modified_date = NOW(), product_name = $4 WHERE mapping_item = $5", [data.other.sku, getItem.item_id, data.other.url, data.basic.name.replace("'", ""), getMappingItem.mapping_item]);
                                                        if(stmt_updateMappingItem.rowCount > 0)
                                                        {
                                                            messageSuccess = {
                                                                shop_id    : data.basic.shopID,
                                                                product_id : data.basic.productID,
                                                                sku        : data.other.sku,
                                                                names      : data.basic.name.replace("'", ""),
                                                                message    : "SUCCESS: UPDATE BINDING ITEM",
                                                            };
                                                            isu.push(messageSuccess);
                                                        }
                                                        else
                                                        {
                                                            messageError = {
                                                                shop_id    : data.basic.shopID,
                                                                product_id : data.basic.productID,
                                                                sku        : data.other.sku,
                                                                names      : data.basic.name.replace("'", ""),
                                                                message    : "FAILED: UPDATE BINDING ITEM",
                                                            };
                                                            isi.push(messageError);
                                                        }
                                                    }
                                                    else{
                                                        let stmt_updateMappingItem = await conn_pg.query("UPDATE mappingitem SET product_code = $1, product_url = $2, modified_date = NOW(), product_name = $3 WHERE mapping_item = $4", [data.other.sku, data.other.url, data.basic.name.replace("'", ""), getMappingItem.mapping_item]);
                                                        if(stmt_updateMappingItem.rowCount > 0)
                                                        {
                                                            messageSuccess = {
                                                                shop_id    : data.basic.shopID,
                                                                product_id : data.basic.productID,
                                                                sku        : data.other.sku,
                                                                names      : data.basic.name.replace("'", ""),
                                                                message    : "SUCCESS: UPDATE SKU CODE WITHOUT UPDATE BIND TO ITEM MASTER",
                                                            };
                                                            isu.push(messageSuccess);
                                                        }
                                                        else
                                                        {
                                                            messageError = {
                                                                shop_id    : data.basic.shopID,
                                                                product_id : data.basic.productID,
                                                                sku        : data.other.sku,
                                                                names      : data.basic.name.replace("'", ""),
                                                                message    : "FAILED: UPDATE SKU CODE WITHOUT UPDATE BIND TO ITEM MASTER",
                                                            };
                                                            isi.push(messageError);
                                                        }
                                                    }
                                                }
                                                else{
                                                    let stmt_updateMappingItem = await conn_pg.query("UPDATE mappingitem SET product_code = $1, product_url = $2, modified_date = NOW(), product_name = $3 WHERE mapping_item = $4", [data.other.sku, data.other.url, data.basic.name.replace("'", ""), getMappingItem.mapping_item]);
                                                    if(stmt_updateMappingItem.rowCount > 0)
                                                    {
                                                        messageSuccess = {
                                                            shop_id    : data.basic.shopID,
                                                            product_id : data.basic.productID,
                                                            sku        : data.other.sku,
                                                            names      : data.basic.name.replace("'", ""),
                                                            message    : "SUCCESS: UPDATE SKU CODE ONLY",
                                                        };
                                                        isu.push(messageSuccess);
                                                    }
                                                    else
                                                    {
                                                        messageError = {
                                                            shop_id    : data.basic.shopID,
                                                            product_id : data.basic.productID,
                                                            sku        : data.other.sku,
                                                            names      : data.basic.name.replace("'", ""),
                                                            message    : "FAILED: UPDATE SKU CODE ONLY",
                                                        };
                                                        isi.push(messageError);
                                                    }
                                                }
                                            }
                                            else{
                                                messageError = {
                                                    shop_id    : data.basic.shopID,
                                                    product_id : data.basic.productID,
                                                    sku        : ((!data.other.sku) ? null : data.other.sku),
                                                    names      : data.basic.name.replace("'", ""),
                                                    "message"  : "FAILED: SKU ALREADY MATCHED",
                                                };
                                                isi.push(messageError);
                                            }
                                        }
                                    }
                                    else{
                                        messageError = {
                                            shop_id    : data.basic.shopID,
                                            product_id : data.basic.productID,
                                            sku        : ((!data.other.sku) ? null : data.other.sku),
                                            names      : data.basic.name.replace("'", ""),
                                            message    : "FAILED: SKU STILL EMPTY OR JUST CONTAIN - (strip)",
                                        };
                                        isi.push(messageError);
                                    }
                                }
                                else{
                                    var sku = (typeof data.other.sku === 'object' && data.other.sku != "" && data.other.sku != "-") ? data.other.sku : data.basic.productID;

                                    let stmt_getItem = await conn_pg.query("SELECT item_id FROM item WHERE client_id = $1 AND code = $2", [configs.client_id,data.other.sku]);
                                    var getItem = stmt_getItem.rows[0];
                                    if(stmt_getItem.rowCount > 0)
                                    {
                                        let stmt_createMappingItem = await conn_pg.query("INSERT INTO mappingitem (item_id, shop_configuration_id, product_id, product_code, product_name, product_url, variant_id, active, created_date, modified_date, created_by, modified_by) VALUES ($1, $2, $3, $4, $5, $6, $7, 1, NOW(), NOW(), 0, 0)", [getItem.item_id, configs.shop_configuration_id, data.basic.productID, sku, data.basic.name.replace("'", ""), data.other.url, data.basic.productID]);
                                        if(stmt_createMappingItem.rowCount > 0)
                                        {
                                            messageSuccess = {
                                                shop_id    : data.basic.shopID,
                                                product_id : data.basic.productID,
                                                sku        : data.other.sku,
                                                names      : data.basic.name.replace("'", ""),
                                                message    : "SUCCESS: CREATE MAPPING ITEM",
                                            };
                                            isu.push(messageSuccess);
                                        }
                                        else
                                        {
                                            messageError = {
                                                shop_id    : data.basic.shopID,
                                                product_id : data.basic.productID,
                                                sku        : data.other.sku,
                                                names      : data.basic.name.replace("'", ""),
                                                message    : "FAILED: CREATE MAPPING ITEM",
                                            };
                                            isi.push(messageError);
                                        }
                                    }
                                    else{
                                        let stmt_createMappingItem = await conn_pg.query("INSERT INTO mappingitem (shop_configuration_id, product_id, product_code, product_name, product_url, variant_id, active, created_date, modified_date, created_by, modified_by) VALUES ($1, $2, $3, $4, $5, $6, 1, NOW(), NOW(), 0, 0)", [configs.shop_configuration_id, data.basic.productID, sku, data.basic.name.replace("'", ""), data.other.url, data.basic.productID]);
                                        if(stmt_createMappingItem.rowCount > 0)
                                        {
                                            messageSuccess = {
                                                shop_id    : data.basic.shopID,
                                                product_id : data.basic.productID,
                                                sku        : data.other.sku,
                                                names      : data.basic.name.replace("'", ""),
                                                message    : "SUCCESS: CREATE MAPPING ITEM WITH NULL ID",
                                            };
                                            isu.push(messageSuccess);
                                        }
                                        else
                                        {
                                            messageError = {
                                                shop_id    : data.basic.shopID,
                                                product_id : data.basic.productID,
                                                sku        : data.other.sku,
                                                names      : data.basic.name.replace("'", ""),
                                                message    : "FAILED: CREATE MAPPING ITEM WITH NULL ID",
                                            };
                                            isi.push(messageError);
                                        }
                                    }
                                }
                            };      
                        }
                        else{
                            messageError = {
                                data   : response.data.message
                            };
                            isi.push(messageError);
                        }
                        // console.log(isi)
                        res.json({
                            status:500,
                            messasge:"Failed",
                            data:isi
                        });
                        // res.json({
                        //     status:200,
                        //     messasge:"Success",
                        //     data:isu
                        // });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                });
            // }
        }
    } catch (error) {
        res.json({
            status : false,
            message: "failed",
            data   : "Server error"
        });
    }
}*/

async function getProduct(req,res,next)
{
    var messageError = {};
    var messageSuccess = {};
    const isi = [];
    const isu = [];
    try 
    {
        const config = await conn_pg.query("SELECT *, shop.shop_name FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id=shop.client_id LEFT JOIN channel ch ON shop.channel_id=ch.channel_id WHERE ch.name='TOKOPEDIA' and shop.sync_product=1 and shop.active=1 and shop.shop_id <> ''");
        if(config.rowCount == 0)
        {
            res.json({
                status: false,
                message: "Shop not found"
            });
        }
        else
        {
            config.rows.forEach(configs => {
                for(var i = 1; i < 10 ; i++)
                {
                    var config = {
                        method: 'GET',
                        url   : 'https://fs.tokopedia.net/inventory/v1/fs/'+configs.fs_id+'/product/info?shop_id='+configs.shop_id+'&page='+i+'&per_page=50&sort=1',
                        // url   : 'https://fs.tokopedia.net/inventory/v1/fs/'+configs.fs_id+'/product/info?shop_id='+configs.shop_id+'&page=1&per_page=10&sort=7',
                        headers: { 
                            'Content-type' : 'application/json',
                            'Content-Length': '0',
                            'Authorization': 'Bearer '+configs.token
                        },
                        validateStatus: () => true
                    };
                    axios(config)
                    .then(async (response)=> {
                        // console.log(response)
                        if(response.status == 200)
                        {
                            // console.log(response.data)
                            for(const item of response.data.data)
                            {
                                var sku         = vars.productID;
                                var productCode = ((typeof item.other.sku === 'object') && item.other.sku != "") ? item.other.sku.toUpperCase() : sku;
                                var productName = vars.name.toUpperCase();
                                var url         = item.other.url;

                                let sql_item = await conn_pg.query("SELECT * FROM item WHERE client_id = $1 AND code = $2", [configs.client_id,productCode]);
                                var res_item = sql_item.rows[0];
                                // console.log(checkMappingItems)
                                if(sql_item.rowCount > 0)
                                {
                                    let sql_mapping = await conn_pg.query("SELECT * FROM mappingitem WHERE product_id = $1 AND shop_configuration_id = $2", [sku,configs.shop_configuration_id]);
                                    var res_mapping = sql_mapping.rows[0];
                                    if(sql_mapping.rowCount == 0)
                                    {
                                        let stmt_updateMappingItem = await conn_pg.query("INSERT INTO mappingitem(item_id, shop_configuration_id, product_id, product_code, product_name, product_url, variant_id, active, created_date, modified_date, created_by, modified_by) values ($1, $2, $3, $4, $5, $6, $7, 1, NOW(), NOW(), 0, 0)", [res_item.item_id, configs.shop_configuration_id, sku, productCode, productName, url, sku]);
                                        if(stmt_updateMappingItem.rowCount > 0)
                                        {
                                            messageSuccess = {
                                                message    : "SUCCESS MAPPING ITEMS "+productName+" ("+sku+") WITH PRODUCT CODE "+productCode,
                                            };
                                            isu.push(messageSuccess);
                                        }
                                        else
                                        {
                                            messageError = {
                                                message    : "FAILED MAPPING ITEMS "+productName+" ("+sku+") WITH PRODUCT CODE "+productCode,
                                            };
                                            isi.push(messageError);
                                        }
                                    }
                                    else{
                                        messageError = {
                                            message    : "FAILED MAPPING ITEMS "+productName+" ("+sku+") WITH PRODUCT CODE "+productCode+" ALREADY EXISTS",
                                        };
                                        isi.push(messageError);
                                    }
                                }
                                else{
                                    let sql_mapping = await conn_pg.query("SELECT * FROM mappingitem WHERE product_id = $1 AND shop_configuration_id = $2", [sku,configs.shop_configuration_id]);
                                    var res_mapping = sql_mapping.rows[0];
                                    if(sql_mapping.rowCount == 0)
                                    {
                                        let sql_items = await conn_pg.query("SELECT * FROM item WHERE client_id = $1 AND code = $2", [configs.client_id,sku]);
                                        var res_items = sql_items.rows[0];
                                        if(sql_items.rowCount > 0)
                                        {
                                            let stmt_updateMappingItem = await conn_pg.query("INSERT INTO mappingitem(item_id, shop_configuration_id, product_id, product_code, product_name, product_url, variant_id, active, created_date, modified_date, created_by, modified_by) values ($1, $2, $3, $4, $5, $6, $7, 1, NOW(), NOW(), 0, 0)", [res_items.item_id, configs.shop_configuration_id, sku, res_items.code, productName, url, sku]);
                                            if(stmt_updateMappingItem.rowCount > 0)
                                            {
                                                messageSuccess = {
                                                    message    : "SUCCESS MAPPING ITEMS "+productName+" ("+sku+")",
                                                };
                                                isu.push(messageSuccess);
                                            }
                                            else
                                            {
                                                messageError = {
                                                    message    : "FAILED MAPPING ITEMS "+productName+" ("+sku+")",
                                                };
                                                isi.push(messageError);
                                            }
                                        }
                                        else{
                                            let stmt_updateMappingItem = await conn_pg.query("INSERT INTO mappingitem(shop_configuration_id, product_id, product_name, product_url, variant_id, active, created_date, modified_date, created_by, modified_by) values ($1, $2, $3, $4, $5, 1, NOW(), NOW(), 0, 0)", [configs.shop_configuration_id, sku, productName, url, sku]);
                                            if(stmt_updateMappingItem.rowCount > 0)
                                            {
                                                messageSuccess = {
                                                    message    : "SUCCESS MAPPING ITEMS "+productName+" ("+sku+") BUT NOT FOUND IN ITEM MASTER",
                                                };
                                                isu.push(messageSuccess);
                                            }
                                            else
                                            {
                                                messageError = {
                                                    message    : "FAILED MAPPING ITEMS "+productName+" ("+sku+") BUT NOT FOUND IN ITEM MASTER",
                                                };
                                                isi.push(messageError);
                                            }
                                        }
                                    }
                                    else{
                                        messageError = {
                                            message    : "FAILED MAPPING ITEMS "+productName+" ("+sku+") ALREADY EXISTS",
                                        };
                                        isi.push(messageError);
                                    }
                                }

                                if(item.variant || item.variant.length > 0 )
                                {
                                    var config = {
                                        method: 'GET',
                                        url   : 'https://fs.tokopedia.net/inventory/v1/fs/'+configs.fs_id+'/product/variant/'+item.basic.productID,
                                        headers: { 
                                            'Content-type' : 'application/json',
                                            'Content-Length': '0',
                                            'Authorization': 'Bearer '+configs.token
                                        },
                                        validateStatus: () => true
                                    };
                                    axios(config)
                                    .then(async (res)=> {
                                        for(const vars of res.data.children){
                                            var product_sku  = vars.product_id;
                                            var product_code = ((typeof vars.sku === 'object')) ? vars.sku.toUpperCase() : product_sku;
                                            var product_name = vars.name.toUpperCase();
                                            var product_url  = vars.url;

                                            let sql_item = await conn_pg.query("SELECT * FROM item WHERE client_id = $1 AND code = $2", [configs.client_id,product_code]);
                                            var res_item = sql_item.rows[0];
                                            // console.log(checkMappingItems)
                                            if(sql_item.rowCount > 0)
                                            {
                                                let sql_mapping = await conn_pg.query("SELECT * FROM mappingitem WHERE product_id = $1 AND shop_configuration_id = $2", [product_sku,configs.shop_configuration_id]);
                                                var res_mapping = sql_mapping.rows[0];
                                                if(sql_mapping.rowCount == 0)
                                                {
                                                    let stmt_updateMappingItem = await conn_pg.query("INSERT INTO mappingitem(item_id, shop_configuration_id, product_id, product_code, product_name, product_url, variant_id, active, created_date, modified_date, created_by, modified_by) values ($1, $2, $3, $4, $5, $6, $7, 1, NOW(), NOW(), 0, 0)", [res_item.item_id, configs.shop_configuration_id, product_sku, product_code, product_name, product_url, product_sku]);
                                                    if(stmt_updateMappingItem.rowCount > 0)
                                                    {
                                                        messageSuccess = {
                                                            message    : "SUCCESS MAPPING ITEMS "+product_name+" ("+product_sku+") WITH PRODUCT CODE "+product_code,
                                                        };
                                                        isu.push(messageSuccess);
                                                    }
                                                    else
                                                    {
                                                        messageError = {
                                                            message    : "FAILED MAPPING ITEMS "+product_name+" ("+product_sku+") WITH PRODUCT CODE "+product_code,
                                                        };
                                                        isi.push(messageError);
                                                    }
                                                }
                                                else{
                                                    messageError = {
                                                        message    : "FAILED MAPPING ITEMS "+product_name+" ("+product_sku+") WITH PRODUCT CODE "+product_code+" ALREADY EXISTS",
                                                    };
                                                    isi.push(messageError);
                                                }
                                            }
                                            else{
                                                let sql_mapping = await conn_pg.query("SELECT * FROM mappingitem WHERE product_id = $1 AND shop_configuration_id = $2", [product_sku,configs.shop_configuration_id]);
                                                var res_mapping = sql_mapping.rows[0];
                                                if(sql_mapping.rowCount == 0)
                                                {
                                                    let sql_items = await conn_pg.query("SELECT * FROM item WHERE client_id = $1 AND code = $2", [configs.client_id,product_sku]);
                                                    var res_items = sql_items.rows[0];
                                                    if(sql_items.rowCount > 0)
                                                    {
                                                        let stmt_updateMappingItem = await conn_pg.query("INSERT INTO mappingitem(item_id, shop_configuration_id, product_id, product_code, product_name, product_url, variant_id, active, created_date, modified_date, created_by, modified_by) values ($1, $2, $3, $4, $5, $6, $7, 1, NOW(), NOW(), 0, 0)", [res_items.item_id, configs.shop_configuration_id, product_sku, res_items.code, product_name, product_url, product_sku]);
                                                        if(stmt_updateMappingItem.rowCount > 0)
                                                        {
                                                            messageSuccess = {
                                                                message    : "SUCCESS MAPPING ITEMS "+product_name+" ("+product_sku+")",
                                                            };
                                                            isu.push(messageSuccess);
                                                        }
                                                        else
                                                        {
                                                            messageError = {
                                                                message    : "FAILED MAPPING ITEMS "+product_name+" ("+product_sku+")",
                                                            };
                                                            isi.push(messageError);
                                                        }
                                                    }
                                                    else{
                                                        let stmt_updateMappingItem = await conn_pg.query("INSERT INTO mappingitem(shop_configuration_id, product_id, product_name, product_url, variant_id, active, created_date, modified_date, created_by, modified_by) values ($1, $2, $3, $4, $5, 1, NOW(), NOW(), 0, 0)", [configs.shop_configuration_id, product_sku, product_name, product_url, product_sku]);
                                                        if(stmt_updateMappingItem.rowCount > 0)
                                                        {
                                                            messageSuccess = {
                                                                message    : "SUCCESS MAPPING ITEMS "+product_name+" ("+product_sku+") BUT NOT FOUND IN ITEM MASTER",
                                                            };
                                                            isu.push(messageSuccess);
                                                        }
                                                        else
                                                        {
                                                            messageError = {
                                                                message    : "FAILED MAPPING ITEMS "+product_name+" ("+product_sku+") BUT NOT FOUND IN ITEM MASTER",
                                                            };
                                                            isi.push(messageError);
                                                        }
                                                    }
                                                }
                                                else{
                                                    messageError = {
                                                        message    : "FAILED MAPPING ITEMS "+product_name+" ("+product_sku+") ALREADY EXISTS",
                                                    };
                                                    isi.push(messageError);
                                                }
                                            }
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                                }
                            };      
                        }
                        else{
                            messageError = {
                                data   : response.data.message
                            };
                            isi.push(messageError);
                        }
                        
                        res.json({
                            status:500,
                            messasge:"Failed",
                            data:isi
                        });
                        // res.json({
                        //     status:200,
                        //     messasge:"Success",
                        //     data:isu
                        // });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }
            });
        }
    } catch (error) {
        res.json({
            status : false,
            message: "failed",
            data   : "Server error"
        });
    }
}

async function saveProduct(configs,items)
{
    let data = await conn_pg.query("INSERT INTO mappingitem( shop_configuration_id, product_id, product_code, product_name, variant_id, active, created_by, modified_by, created_date) VALUES ($1,$2,$3,$4,$5,1,0,0,NOW())",[configs.shop_configuration_id,items.product_id,items.sku,items.name,items.product_id]);
    if(data.rowCount == 0)
    {
        console.log("Success");
    }
}

async function storeOrders(orderCode, clientId, channelId, shopConfigurationId, stockTypeId, orderTypeId, deliveryTypeId, locationId, refOrderId, bookingNumber, waybillNumber, totalPrice, dataCust, timeStamp, totalProductPrice, discount, shippingPrice, discountShipping, paymentId, codPrice, remarks, shopName, stockSource, latitude, longitude, items)
{
    // return orderCode;
    let pg = await conn_pg.connect();
    try {    
        await pg.query('BEGIN') 
        var statusId = 70;
        var createdName = "Automatic By System API";
        const date = moment().format("YYYY-MM-DD HH:mm:ss");
        let orderheaders = await pg.query("INSERT INTO orderheader(order_code, location_id, client_id, shop_configuration_id, status_id, delivery_type_id, payment_type_id, channel_id, stock_type_id, order_type_id, ref_order_id, code, order_date, booking_number, waybill_number, recipient_name, recipient_phone, recipient_email, recipient_address, recipient_district, recipient_city, recipient_province, recipient_country, recipient_postal_code, latitude, longitude, total_koli, shipping_price, total_price, cod_price, dfod_price, stock_source, notes, remark, created_date, modified_date, created_by, modified_by, created_name, store_name, discount, discount_shipping, total_product_price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, null, $18, $19, $20, $21, $22, $23, $24, $25, 0, $26, $27, $28, 0, $29, $30, $31, $32, $33, 0, 0, $34, $35, $36, $37, $38) RETURNING order_header_id, status_id",[orderCode, locationId, clientId, shopConfigurationId, statusId, deliveryTypeId, paymentId, channelId, stockTypeId, orderTypeId, refOrderId, orderCode, timeStamp, bookingNumber, waybillNumber, dataCust.recipient.name, dataCust.recipient.phone, dataCust.recipient.address.address_full, dataCust.recipient.address.district, dataCust.recipient.address.city, dataCust.recipient.address.province, dataCust.recipient.address.country, dataCust.recipient.address.postal_code, latitude, longitude, shippingPrice, totalPrice, codPrice, stockSource, remarks, remarks, date, date, createdName, shopName, discount, discountShipping, totalProductPrice]);
        var orderHeader = orderheaders.rows[0];
        if(orderheaders.rowCount > 0)
        {    
            let jobpushorders = await pg.query("INSERT INTO jobpushorder(order_header_id, created_date) VALUES($1, $2)",[orderHeader.order_header_id,date]);
            if(jobpushorders.rowCount > 0)
            {
                let orderhistorys = await pg.query("INSERT INTO orderhistory(order_header_id, status_id, updated_by, update_date, created_date, created_by, modified_by) VALUES ($1, $2, $3, $4, $5, 0, 0)",[orderHeader.order_header_id,orderHeader.status_id,createdName,date,date]);
                if(orderhistorys.rowCount > 0)
                {
                    let insertDetails = await pg.query("INSERT INTO orderdetail(order_code, order_header_id, item_id, order_quantity, unit_price, total_unit_price, unit_weight, status_id, created_date, modified_date, created_by, modified_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, 0)",[orderCode, orderHeader.order_header_id, items.item_id, items.quantity, items.unit_price, (items.quantity*items.unit_price), items.item_weight, orderHeader.status_id]);
                    if(insertDetails.rowCount > 0)
                    {
                        await pg.query('COMMIT')
                        messageSuccess = {
                            status : 200,
                            message : "Success Create Order",
                            detail : {
                                data : "GET ORDERS - Order code "+orderCode+" has created header and detail successfully"
                            }
                        };
                        return messageSuccess;
                        // console.log(messageSuccess);
                    }
                    else{                                                
                        await pg.query('ROLLBACK')
                        messageError = {
                            status : 500,
                            message : "Failed Create Order",
                            detail : {
                                data : "GET ORDERS - Failed Create Order code "+orderCode
                            }
                        };
                        return messageError;
                        // console.log(messageError);
                    }
                }
                else{
                    await pg.query('ROLLBACK')
                }
            }
            else{
                await pg.query('ROLLBACK')
            }
        }
        else{
            await pg.query('ROLLBACK')
        }
        // await conn_pg.query('COMMIT')
    } catch (e) {
        await pg.query('ROLLBACK')
        throw e
    }
}

async function setMonth(date)
{
    var mounth = '';
    if(date == 0)
        mounth = "01"
    if(date == 1)
        mounth = "02"
    if(date == 2)
        mounth = "03"
    if(date == 3)
        mounth = "04"
    if(date == 4)
        mounth = "05"
    if(date == 5)
        mounth = "06"
    if(date == 6)
        mounth = "07"
    if(date == 7)
        mounth = "08"
    if(date == 8)
        mounth = "09"
    if(date == 9)
        mounth = "10"
    if(date == 10)
        mounth = "11"
    if(date == 11)
        mounth = "12"

    return mounth;
}

async function decryptTokped(playload){
    const privateKey     = fs.readFileSync('tokopedia/tokopedia_privatekey_prod.pem');
    // const webhookPayload = playload;
    const result         = decryptContent(privateKey, playload.encryption);

    // console.log(result); /* { customer: { ... }, recipient: { ... } } */
    return result;
}

async function checkOrderCode(orderCode,clientId)
{
    // var resIsInOrders = "";
    let res_isInOrder = await conn_pg.query("SELECT code, order_code FROM orderheader WHERE code = $1 AND client_id = $2",[orderCode,clientId]);
    var resIsInOrders = res_isInOrder.rows[0];
    // console.log(res_isInOrder.rows)
    if(res_isInOrder.rowCount > 0)
    {
        return resIsInOrders;
    }
}

async function checkMappingItemId(productId, shopConfigId)
{
    let result_mapping = await conn_pg.query("SELECT * FROM mappingitem WHERE shop_configuration_id = $1 and product_id = $2", [shopConfigId,productId]);
    var checkMappingItems = result_mapping.rows[0];
    if(result_mapping.rowCount > 0)
    {
        return checkMappingItems;
    }
}

async function checkMappingItemCode(productCode, shopConfigId)
{
    let result_mapping = await conn_pg.query("SELECT * FROM mappingitem WHERE shop_configuration_id = $1 and product_code = $2", [shopConfigId,productCode]);
    var checkMappingItems = result_mapping.rows[0];
    if(result_mapping.rowCount > 0)
    {
        return checkMappingItems;
    }
}

async function findCourier(courier, serviceType)
{
    // console.log(channelName);
    let selectCourier = await conn_pg.query("SELECT c.name as courier, d.name as type, d.delivery_type_id, mp.courier_name FROM courier c LEFT JOIN deliverytype d on c.courier_id=d.courier_id LEFT JOIN mappingcourier mp on d.delivery_type_id=mp.delivery_type_id LEFT JOIN channel ch ON mp.channel_id = ch.channel_id WHERE mp.courier_name= $1 and mp.service_type = $2 AND ch.name = 'TOKOPEDIA'", [courier,serviceType]);
    var Courier = selectCourier.rows[0];
    if(selectCourier.rowCount > 0)
    {
        return Courier;
    }
}

async function checkShopLocation(locationId,shopConfigId)
{
    let sql = await conn_pg.query("SELECT a.location_channel, b.name AS location_name, b.code AS location_code, b.location_id AS locationId FROM shoplocation a LEFT JOIN location b ON a.location_id = b.location_id WHERE a.location_channel = $1 AND a.shop_configuration_id = $2",[locationId,shopConfigId]);
    // var results = sql.rows[0];
    // console.log(sql.rowCount > 0)
    if(sql.rowCount > 0)
    {
        return sql.rows[0];
    }
    // else{
    //     return ""
    // }
}

async function checkStockType(clientId,stockType)
{
    var restockTypes = "";
    let res_stockType = await conn_pg.query("SELECT stock_type_id FROM stocktype WHERE client_id = $1 AND name = $2",[clientId,stockType]);
    restockTypes = res_stockType.rows[0];
    if(res_stockType.rowCount > 0)
    {
        return restockTypes;
    }
}

async function dataTest(){
    var data = {
        status: 200,
        data: "oke"
    }
    return data
}
 
module.exports ={
    generateToken,
    test,
    getOrder,
    shopInfo,
    getProduct
}