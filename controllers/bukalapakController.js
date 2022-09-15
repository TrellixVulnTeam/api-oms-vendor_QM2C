const jwt        = require('jsonwebtoken');
const conn       = require('../dbConnection').promise();
const axios      = require('axios');
const { param }  = require('express/lib/request');
const logger     = require('../logs');
const cron       = require('node-cron');
const nodeBase64 = require('nodejs-base64-converter');
const conn_pg    = require('../dbConnection_pg');
const { json } = require('express');
const e = require('express');

//accounts.bukalapak.com/oauth/authorize?client_id=uiZ2HP2X3_jiYuztm6RFeCrA-itXNslvRM9wATdqYc8&redirect_uri=https://oms.titipaja.co.id/callback_prod.php&scope=public user store&response_type=code
async function getToken (req,res,next) 
{
    try
    {
        var messageSuccess = {};
        var messageError = {};

        const configs = await conn_pg.query("SELECT shop.shop_configuration_id, shop.shop_id, shop.shop_name, shop.fs_id, shop.client_code, shop.client_secret, shop.token FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id = shop.client_id LEFT JOIN channel ch ON shop.channel_id = ch.channel_id WHERE ch.name = 'BUKALAPAK' AND shop.active = 1");
        if(configs.rowCount > 0){
            configs.forEach(async function(config)
            {
                if(config.active == 1 && config.shop_id == 'client_credentials')
                {
                    let payload = {
                        grant_type    : 'authorization_code',
                        client_id     : config.fs_id,
                        client_secret : config.client_secret,
                        code          : config.token,
                        redirect_uri  : 'https://oms.titipaja.co.id/callback_prod.php'
                    };
                    // var payload = JSON.stringify(reqBody);
            
                    // console.log(payload);
                    var axios = require('axios');
                    var config = {
                        method: 'POST',
                        url   : 'https://accounts.bukalapak.com/oauth/token',
                        headers: { 
                            'Content-Type': 'application/json',
                            'User-Agent'  : 'Bukalapak/TUA(Partner;AjwmqBUcIHXPBNiSEIXbAQwuYSZULHkL;+https://www.bukalapak.com)'
                        },
                        data  : payload,
                        validateStatus: () => true
                    };
                    axios(config)
                    .then(async (response)=> 
                    {
                        if(response.error == 'invalid_grant')
                        {
                            messageError = {
                                status : 500,
                                message: "FAILED GET TOKEN",
                                detail : response
                            };
                            // console.log(messageError);
                            res.json(messageError);
                        }
                        else
                        {
                            let update = await conn_pg.query("UPDATE shopconfiguration SET client_code = $1, salt = $2 WHERE shop_configuration_id = $3", [response.refresh_token,response.access_token,config.shop_configuration_id]);
                            if(update.rowCount > 0)
                            {
                                res.json({
                                    status : 200,
                                    message: "OK",
                                    data   : "JUBELIO AUTH - SUCCESSFULLY GENERATE TOKEN FOR THIS SHOP "+config.shop_name
                                });
                            }
                            else
                            {
                                res.json({
                                    status : 500,
                                    message: "FAILED",
                                    data   : "JUBELIO AUTH - FAILED TO GET TOKEN FOR THIS SHOP "+config.shop_name
                                });
                            }
                        }
                    })
                    .catch(function (error) 
                    {
                        res.json({
                            status : false,
                            message: "failed",
                            data   : "Server error"
                        });
                    });
                }
            });
        }
        else{
            messageError = {
                status : 500,
                message: "FAILED GET CLIENT",
                detail : "SET TOKEN - FAILED TO GET CLIENT BECAUSE "+shopName+" NOT FOUND IN SHOP CONFIGURATION"
            };
            // console.log(messageError);
            res.json(messageError);
        }
    }
    catch (error) 
    {
        res.json({
            status : false,
            message: "failed",
            data   : "Server error"
        });
    }
}

async function getRefreshToken (req,res,next) 
{
    try
    {
        var messageSuccess = {};
        var messageError = {};

        const configs = await conn_pg.query("SELECT shop.shop_configuration_id, shop.shop_id, shop.shop_name, shop.fs_id, shop.client_code, shop.client_secret, shop.token FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id = shop.client_id LEFT JOIN channel ch ON shop.channel_id = ch.channel_id WHERE ch.name = 'BUKALAPAK' AND shop.active = 1");
        if(configs.rowCount > 0){
            configs.forEach(async function(config)
            {
                if(config.active == 1 && config.shop_id == 'client_credentials')
                {
                    let payload = {
                        grant_type   : 'refresh_token',
                        client_id    : config.fs_id,
                        client_secret: config.client_secret,
                        refresh_token: config.client_code
                    };
                    // var payload = JSON.stringify(reqBody);
            
                    // console.log(payload);
                    var axios = require('axios');
                    var config = {
                        method: 'POST',
                        url   : 'https://accounts.bukalapak.com/oauth/token',
                        headers: { 
                            'Content-type': 'application/json', 
                            'User-Agent'  : 'Bukalapak/TUA(Partner;AjwmqBUcIHXPBNiSEIXbAQwuYSZULHkL;+https://www.bukalapak.com)'
                        },
                        data  : payload,
                        validateStatus: () => true
                    };
                    axios(config)
                    .then(async (response)=> 
                    {
                        if(response.error == 'invalid_grant')
                        {
                            messageError = {
                                status : 500,
                                message: "FAILED GET TOKEN",
                                detail : response
                            };
                            // console.log(messageError);
                            res.json(messageError);
                        }
                        else
                        {
                            let update = await conn_pg.query("UPDATE shopconfiguration SET client_code = $1, salt = $2 WHERE shop_configuration_id = $3", [response.refresh_token,response.access_token,config.shop_configuration_id]);
                            if(update.rowCount > 0)
                            {
                                res.json({
                                    status : 200,
                                    message: "OK",
                                    data   : "JUBELIO AUTH - SUCCESSFULLY GENERATE TOKEN FOR THIS SHOP "+config.shop_name
                                });
                            }
                            else
                            {
                                res.json({
                                    status : 500,
                                    message: "FAILED",
                                    data   : "JUBELIO AUTH - FAILED TO GET TOKEN FOR THIS SHOP "+config.shop_name
                                });
                            }
                        }
                    })
                    .catch(function (error) 
                    {
                        res.json({
                            status : false,
                            message: "failed",
                            data   : "Server error"
                        });
                    });
                }
            });
        }
        else{
            messageError = {
                status : 500,
                message: "FAILED GET CLIENT",
                detail : "SET TOKEN - FAILED TO GET CLIENT BECAUSE "+shopName+" NOT FOUND IN SHOP CONFIGURATION"
            };
            // console.log(messageError);
            res.json(messageError);
        }
    }
    catch (error) 
    {
        res.json({
            status : false,
            message: "failed",
            data   : "Server error"
        });
    }
}

async function getProduct (req,res,next) 
{
    try
    {
        var messageSuccess = {};
        var messageError = {};
        const shopconfigs = await conn_pg.query("SELECT shop.client_id, shop.shop_configuration_id, shop.shop_id, shop.shop_name, shop.fs_id, shop.client_code, shop.client_secret, shop.token, shop.salt FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id = shop.client_id LEFT JOIN channel ch ON shop.channel_id = ch.channel_id WHERE ch.name = 'BUKALAPAK' AND shop.active = 1 AND shop.sync_product = 1");
        if(shopconfigs.rowCount > 0){
            var configs = shopconfigs.rows;
            configs.forEach(async function(rest)
            {
                if(rest.shop_id == 'client_credentials')
                {
                    var offset = 1;
                    var i = 0; 
                    for(i; i < 10 ; i++)
                    {
                        var total = i*offset;
                
                        var axios = require('axios');
                        var config = {
                            method: 'GET',
                            url   : 'https://api.bukalapak.com/stores/me/products?offset='+total+'&limit=10',
                            headers: { 
                                'Content-type': 'application/json', 
                                'Authorization': 'Bearer '+rest.salt,
                                'User-Agent'  : 'Bukalapak/TUA(Partner;AjwmqBUcIHXPBNiSEIXbAQwuYSZULHkL;+https://www.bukalapak.com)'
                            },
                            validateStatus: () => true
                        };
                        axios(config)
                        .then(async (response)=> 
                        {
                            var datas = response.data;
                            // console.log(datas.errors[0].code);
                            if(datas.meta.http_status == 200)
                            {
                                datas.data.forEach(async function(value)
                                {
                                    if(value.variants)
                                    {
                                        value.variants.forEach(async function(variants){
                                            var name      = value.name+" - "+variants.variant_name;
                                            var url       = value.url;
                                            var sku       = variants.sku_name;
                                            var productId = variants.product_id;
                                            var skuId     = variants.id;
                                            
                                            let result_mapping = await conn_pg.query("SELECT product_code,product_name FROM mappingitem WHERE variant_id = $1 AND shop_configuration_id = $2", [sku,rest.shop_configuration_id]);
                                            var checkMappingItems = result_mapping.rows;
                                            if(result_mapping.rowCount == 0)
                                            {
                                                // console.log("kosong");
                                                let checkItem = await conn_pg.query("SELECT item_id FROM item WHERE code = $1 AND client_id = $2", [sku,rest.client_id]);
                                                var chekItems = checkItem.rows;
                                                if (checkItem.rowCount > 0) 
                                                {
                                                    chekItems.forEach(function(chekItem)
                                                    {  
                                                        var insert = insertIntoMappingItem(chekItem.item_id,rest.shop_configuration_id,skuId,productId,name,url,sku);
                                                        if(insert)
                                                        {
                                                            messageSuccess = {
                                                                status : 200,
                                                                message : "Success Mapping Item",
                                                                detail : {
                                                                    data : "MAPPING ITEM - "+sku+" has mapped successfully"
                                                                }
                                                            };
                                                            // console.log(messageSuccess);
                                                            // res.json({messageNullItemId});
                                                            res.json(messageSuccess);
                                                        }
                                                    });
                                                }
                                                else{
                                                    var insert = insertIntoMappingItemWithNullItemId(rest.shop_configuration_id,skuId,productId,name,url,sku);
                                                    if(insert)
                                                    {
                                                        messageSuccess = {
                                                            status : 200,
                                                            message : "Mapping With Null Item Id",
                                                            detail : {
                                                                data : "MAPPING ITEM - Mapping With Null Item Id For "+sku+" cause by No Reference Found in MASTER ITEM"
                                                            }
                                                        };
                                                        // console.log(messageSuccess);
                                                        // res.json({messageNullItemId});
                                                        res.json(messageSuccess);
                                                    }
                                                }
                                            }
                                            else{
                                                console.log(checkMappingItems);
                                                checkMappingItems.data.forEach(async function(checkMappingItem)
                                                {
                                                    if(checkMappingItem.product_code != productId || checkMappingItem.product_name != name)
                                                    {
                                                        let checkItem = await conn_pg.query("SELECT item_id FROM item WHERE code = $1 AND client_id = $2", [sku,rest.client_id]);
                                                        var chekItems = checkItem.rows;
                                                        if (checkItem.rowCount > 0) 
                                                        {
                                                            chekItems.forEach(function(chekItem)
                                                            {  
                                                                var update = updateMappingItemByVariantAndShop(chekItem.item_id,productId,sku,rest.shop_configuration_id);
                                                                if(update)
                                                                {
                                                                    messageSuccess = {
                                                                        status : 200,
                                                                        message : "Success Update Mapping",
                                                                        detail : {
                                                                            data : "MAPPING ITEM - "+sku+" has been updated succesfully"
                                                                        }
                                                                    };
                                                                    // console.log(messageSuccess);
                                                                    // res.json({messageUpdate});
                                                                    res.json(messageSuccess);
                                                                }
                                                            });
                                                        }
                                                        else 
                                                        {
                                                            messageError = {
                                                                status : 500,
                                                                message : "Failed",
                                                                detail : {
                                                                    data : "Failed while update mapping item because Item Code "+sku+" is not exist in Haistar System. Please regist this item first or update sku on old item."
                                                                }
                                                            };
                                                            // console.log(messageError);
                                                            // res.json({messageFailedUpdate});
                                                            res.json(messageError);
                                                        }
                                                    }
                                                    else
                                                    {
                                                        messageError = {
                                                            status : 500,
                                                            message : "Item Already Exist",
                                                            detail : {
                                                                data : "MAPPING ITEM - Itemcode "+sku+" has exist in MAPPING ITEM but item id is null"
                                                            }
                                                        };
                                                        // console.log(messageError);
                                                        // res.json({messageAlreadyExist});
                                                        res.json(messageError);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else
                                    {
                                        // console.log("single");
                                        var sku       = value.sku_name;
                                        var productId = value.id;
                                        var skuId     = value.sku_id;
                                        var name      = value.name;
                                        var url       = value.url;
                                        
                                        let result_mapping = await conn_pg.query("SELECT product_code,product_name FROM mappingitem WHERE product_code = $1 AND shop_configuration_id = $2", [productId,rest.shop_configuration_id]);
                                        var checkMappingItems = result_mapping.rows;
                                        if(result_mapping.rowCount == 0)
                                        {
                                            let checkItem = await conn_pg.query("SELECT item_id FROM item WHERE code = $1 AND client_id = $2", [sku,rest.client_id]);
                                            var chekItems = checkItem.rows;
                                            if (checkItem.rowCount > 0) 
                                            {
                                                chekItems.forEach(function(chekItem)
                                                {  
                                                    var insert = insertIntoMappingItem(chekItem.item_id,rest.shop_configuration_id,skuId,productId,name,url,sku);
                                                    if(insert)
                                                    {
                                                        messageSuccess = {
                                                            status : 200,
                                                            message : "Success Mapping Item",
                                                            detail : {
                                                                data : "MAPPING ITEM - "+sku+" has mapped successfully"
                                                            }
                                                        };
                                                        // console.log(messageSuccess);
                                                        // res.json({messageNullItemId});
                                                        res.json(messageSuccess);
                                                    }
                                                });
                                            }
                                            else{
                                                var insert = insertIntoMappingItemWithNullItemId(rest.shop_configuration_id,skuId,productId,name,url,sku);
                                                if(insert)
                                                {
                                                    messageSuccess = {
                                                        status : 200,
                                                        message : "Mapping With Null Item Id",
                                                        detail : {
                                                            data : "MAPPING ITEM - Mapping With Null Item Id For "+sku+" cause by No Reference Found in MASTER ITEM"
                                                        }
                                                    };
                                                    // console.log(messageSuccess);
                                                    // res.json({messageNullItemId});
                                                    res.json(messageSuccess);
                                                }
                                            }
                                        }
                                        else{
                                            checkMappingItems.data.forEach(async function(checkMappingItem)
                                            {
                                                if(checkMappingItem.product_code != productId || checkMappingItem.product_name != name)
                                                {
                                                    let checkItem = await conn_pg.query("SELECT item_id FROM item WHERE code = $1 AND client_id = $2", [sku,rest.client_id]);
                                                    var chekItems = checkItem.rows;
                                                    if (checkItem.rowCount > 0) 
                                                    {
                                                        chekItems.forEach(function(chekItem)
                                                        {  
                                                            var update = updateMappingItemByVariantAndShop(chekItem.item_id,productId,sku,rest.shop_configuration_id);
                                                            if(update)
                                                            {
                                                                var messageUpdate = {
                                                                    status : 200,
                                                                    message : "Success Update Mapping",
                                                                    detail : {
                                                                        data : "MAPPING ITEM - "+sku+" has been updated succesfully"
                                                                    }
                                                                };
                                                                // console.log(messageUpdate);
                                                                // res.json({messageUpdate});
                                                                res.json(messageUpdate);
                                                            }
                                                        });
                                                    }
                                                    else 
                                                    {
                                                        var messageError = {
                                                            status : 500,
                                                            message : "Failed",
                                                            detail : {
                                                                data : "Failed while update mapping item because Item Code "+sku+" is not exist in Haistar System. Please regist this item first or update sku on old item."
                                                            }
                                                        };
                                                        // console.log(messageError);
                                                        // res.json({messageFailedUpdate});
                                                        res.json(messageError);
                                                    }
                                                }
                                                else
                                                {
                                                    var messageError = {
                                                        status : 500,
                                                        message : "Item Already Exist",
                                                        detail : {
                                                            data : "MAPPING ITEM - Itemcode "+sku+" has exist in MAPPING ITEM but item id is null"
                                                        }
                                                    };
                                                    // console.log(messageError);
                                                    // res.json({messageAlreadyExist});
                                                    res.json(messageError);
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            else{
                                messageError = {
                                    status : datas.meta.http_status,
                                    message: datas.errors[0].message,
                                    detail : datas.errors
                                };
                                // console.log(messageError);
                                res.json(messageError);
                            }
                        })
                        .catch(function (error) 
                        {
                            res.json({
                                status : false,
                                message: "failed",
                                data   : "Server error"
                            });
                        });
                    }
                }
            });
        }
        else{
            messageError = {
                status : 500,
                message: "FAILED GET CLIENT",
                detail : "SET TOKEN - FAILED TO GET CLIENT BECAUSE "+shopName+" NOT FOUND IN SHOP CONFIGURATION"
            };
            // console.log(messageError);
            res.json(messageError);
        }
    }
    catch (error) 
    {
        res.json({
            status : false,
            message: "failed",
            data   : "Server error"
        });
    }
}

async function getOrders (req,res,next) 
{
    try
    {
        var messageSuccess = {};
        var messageError = {};

        const shopconfigs = await conn_pg.query("SELECT shop.client_id, shop.channel_id, shop.shop_configuration_id, shop.shop_id, shop.shop_name, shop.fs_id, shop.client_code, shop.client_secret, shop.token, shop.salt, cl.multi_channel FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id = shop.client_id LEFT JOIN channel ch ON shop.channel_id = ch.channel_id WHERE ch.name = 'BUKALAPAK' AND shop.active = 1 AND shop.get_order = 1");
        if(shopconfigs.rowCount > 0){
            var configs = shopconfigs.rows;
            configs.forEach(async function(rest)
            {
                var shopConfigurationId = rest.shop_configuration_id;
                var clientId            = rest.client_id;
                var channelId           = rest.channel_id;
                var channelName         = "BUKALAPAK";
                var stockSource         = "GOOD STOCK";
                rest.multi_channel == 1 ? stockType = "MULTI CHANNEL" : stockType = channelName;
                if(rest.shop_id == 'client_credentials')
                {
                    var date = new Date();
                    var s = date.getDate()-4;
                    var start = date.getFullYear()+"-"+date.getMonth()+"-"+s+"T00:00:01.000Z";
                    var end_date = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+"T00:00:01.000Z";
            
                    var axios = require('axios');
                    var config = {
                        method: 'GET',
                        // url   : 'https://api.bukalapak.com/transactions?states=paid&start_time='+start+'&end_time='+end_date,
                        url   : 'https://api.bukalapak.com/transactions?start_time='+start+'&end_time='+end_date,
                        headers: { 
                            'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8',
                            'Authorization': 'Bearer '+rest.salt,
                            'User-Agent'   : 'Bukalapak/TUA(Partner;AjwmqBUcIHXPBNiSEIXbAQwuYSZULHkL;+https://www.bukalapak.com)'
                        },
                        validateStatus: () => true
                    };
                    axios(config)
                    .then(async (response)=> 
                    {
                        var datas = response.data;
                        if(datas.meta.http_status == 200)
                        {
                            datas.data.forEach(async function(value)
                            {
                                var discount = 0;
                                var discounts = value.amount.seller.details.reductions;
                                discounts.forEach(async function(dis)
                                {
                                    if(dis.name == 'Diskon Flash Deal dari Pelapak' || dis.name == 'Potongan Voucher')
                                    {
                                        var flash_deal = 0;
                                        if(dis.name == 'Diskon Flash Deal dari Pelapak')
                                        {
                                            flash_deal = dis.amount;
                                        }
                                        
                                        var vocher = 0;
                                        if(dis.name == 'Potongan Voucher')
                                        {
                                            vocher = dis.amount;
                                        }
                                        
                                        discount = parseInt(flash_deal+vocher);
                                    }
                                    else if (dis.name == 'Diskon Flash Deal dari Pelapak')
                                    {
                                        discount = parseInt(dis.amount);
                                    }
                                    else if (dis.name == 'Potongan Voucher')
                                    {
                                        discount = parseInt(dis.amount);
                                    }
                                });
                                
                                var orderCode = value.transaction_id.toUpperCase();                      
                                let isInOrders = await checkOrderCode(orderCode);
                                if(!isInOrders)
                                {
                                    let checkMappingLocations = await checkShopLocation(shopConfigurationId);
                                    if(checkMappingLocations)
                                    {
                                        checkMappingLocations.forEach(async function(checkMappingLocation)
                                        {                 
                                            var dates               = new Date(value.created_at);
                                            let month               = await setMonth(dates.getMonth());
                                            var timeStamp           = dates.getFullYear()+"-"+month+"-"+dates.getDate()+" "+dates.getHours()+":"+dates.getMinutes()+":"+dates.getSeconds();
                                            var shipping            = value.delivery.requested_carrier;
                                            var locationId          = checkMappingLocation.location_id;
                                            var refOrderId          = value.id;
                                            var paymentId           = 2;
                                            var orderTypeId         = 1;
                                            var recipientName       = value.delivery.consignee.name.toUpperCase();
                                            var recipientPhone      = value.delivery.consignee.phone;
                                            var recipientAddress    = value.delivery.consignee.address.toUpperCase();
                                            var recipientEmail      = null;
                                            var recipientDistrict   = value.delivery.consignee.district.toUpperCase();
                                            var recipientCity       = value.delivery.consignee.city.toUpperCase();
                                            var recipientProvince   = value.delivery.consignee.province.toUpperCase();
                                            var recipientCountry    = value.delivery.consignee.country.toUpperCase();
                                            var recipientPostalCode = value.delivery.consignee.postal_code;
                                            var shippingPrice       = parseInt(value.amount.seller.details.delivery);
                                            var totalProductPrice   = parseInt(value.amount.seller.details.items);
                                            var totalPrice          = parseInt(value.amount.seller.total);
                                            var waybillNumber       = value.delivery.tracking_number;
                                            var bookingNumber       = null;
                                            var codPrice            = 0;
                                            var remarks             = value.options.buyer_note;
                                            var shopName            = rest.shop_name;
                                            let isCourierMapped = await findCourier(shipping, channelName); 
                                            if(isCourierMapped)
                                            {
                                                isCourierMapped.forEach(async function(CourierMapped)
                                                {  
                                                    let isStockTypes = await checkStockType(clientId,stockType);
                                                    if(isStockTypes){
                                                        isStockTypes.forEach(async function(isStockType)
                                                        {   
                                                            var items = value.items;
                                                            var stockTypeId = isStockType.stock_type_id;
                                                            let callStore = await storeOrders(orderCode, clientId, channelId, shopConfigurationId, stockTypeId, orderTypeId, CourierMapped.delivery_type_id, locationId, refOrderId, bookingNumber, waybillNumber, totalPrice, recipientName, recipientPhone, recipientAddress, recipientEmail, recipientDistrict, recipientCity, recipientProvince, recipientCountry, recipientPostalCode, timeStamp, totalProductPrice, discount, shippingPrice, paymentId, codPrice, remarks, shopName, stockSource, items);
                                                            if(callStore)
                                                            { 
                                                                messageSuccess = {
                                                                    status : 200,
                                                                    message : "Success Create Order",
                                                                    detail : {
                                                                        data : "GET ORDERS - Order code "+orderCode+" has created header and detail successfully"
                                                                    }
                                                                };
                                                                // console.log(messageSuccess);
                                                                res.json(messageSuccess);
                                                            }
                                                            else{
                                                                messageError = {
                                                                    status : 500,
                                                                    message : "Failed Create Order",
                                                                    detail : {
                                                                        data : "GET ORDERS - Order code "+orderCode+" has created header and detail failed"
                                                                    }
                                                                };
                                                                // console.log(messageError);
                                                                res.json(messageError);
                                                            }
                                                        });
                                                    }
                                                    else{                                                        
                                                        messageError = {
                                                            status : 500,
                                                            message : "Stock Type Not Mapping",
                                                            detail : {
                                                                data : "GET ORDERS - Stock Type "+stockType+" Not Mapping"
                                                            }
                                                        };
                                                        // console.log(messageError);
                                                        res.json(messageError);
                                                    }
                                                });
                                            }
                                            else{                                                 
                                                messageError = {
                                                    status : 401,
                                                    message : "NOT_MAPPING",
                                                    detail : {
                                                        data : "GET ORDER - COURIER "+shipping+" DOESNT HAS MAPPING"
                                                    }
                                                };
                                                // console.log(messageError);
                                                res.json(messageError);
                                            }
                                        });
                                    }
                                    else{                                        
                                        messageError = {
                                            status : 401,
                                            message : "NOT_MAPPING",
                                            detail : {
                                                data : "GET ORDER - THIS CLIENT "+rest.shop_name+" DOESNT HAS MAPPING"
                                            }
                                        };
                                        // console.log(messageError);
                                        res.json(messageError);
                                    }
                                }
                                else{                                    
                                    messageError = {
                                        status : 500,
                                        message: "FAILED",
                                        detail : "order code "+orderCode+" already exist"
                                    };
                                    // console.log(messageError);  
                                    res.json(messageError);                                  
                                }
                            });
                        }
                        else{
                            
                            messageError = {
                                status : datas.meta.http_status,
                                message: datas.errors[0].message,
                                detail : datas.errors
                            };
                            // console.log(messageError);
                            res.json(messageError);
                        }
                    })
                    .catch(function (error) 
                    {   
                        res.json({
                            status : false,
                            message: "failed",
                            data   : "Server error"
                        });
                    });
                }
            });
        }
        else{
            messageError = {
                status : 500,
                message: "FAILED GET CLIENT",
                detail : "SET TOKEN - FAILED TO GET CLIENT BECAUSE "+shopName+" NOT FOUND IN SHOP CONFIGURATION"
            };
            // console.log(messageError);
            res.json(messageError);
        }
    }
    catch (error) 
    {
        res.json({
            status : false,
            message: "failed",
            data   : "Server error"
        });
    }
}

async function getCob(req,res,next)
{
    try
    {
        var messageSuccess = {};
        var messageError = {};

        const shopconfigs = await conn_pg.query("SELECT shop.client_id, shop.channel_id, shop.shop_configuration_id, shop.shop_id, shop.shop_name, shop.fs_id, shop.client_code, shop.client_secret, shop.token, shop.salt, cl.code AS clientCode, cl.multi_channel, ch.name FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id = shop.client_id LEFT JOIN channel ch ON shop.channel_id = ch.channel_id WHERE ch.name = 'BUKALAPAK' AND shop.active = 1 AND shop.get_resi = 1");
        if(shopconfigs.rowCount > 0){
            var configs = shopconfigs.rows;
            configs.forEach(async function(rest)
            {
                var shopConfigId = rest.shop_configuration_id;
                var channelName = rest.name;
                var booking_code = "";
                let cekOrders = await getOrdersAwbPacked(channelName,shopConfigId);
                if(cekOrders){
                    cekOrders.forEach(async function(value)
                    {
                        var axios = require('axios');
                        var config = {
                            method: 'GET',
                            url   : 'https://api.bukalapak.com/transactions/'+value.ref_order_id,
                            headers: { 
                                'Content-type': 'application/json', 
                                'Authorization': 'Bearer '+rest.salt,
                                'User-Agent'  : 'Bukalapak/TUA(Partner;AjwmqBUcIHXPBNiSEIXbAQwuYSZULHkL;+https://www.bukalapak.com)'
                            },
                            validateStatus: () => true
                        };
                        axios(config)
                        .then(async (response)=> 
                        {
                            var datas = response.data;
                            // console.log(datas.errors[0].code);
                            if(response.meta.http_status == 200)
                            {
                                datas.forEach(async function(value)
                                {
                                    booking_code = value.delivery.tracking_number;
                                    if(booking_code)
                                    {
                                        let updateCobHeader = await updateAwbByOrderHeaderId(booking_code,value.order_header_id);
                                        if(updateCobHeader)
                                        { 
                                            messageSuccess = {
                                                status : 200,
                                                message : "Success Create Order",
                                                detail : {
                                                    data : "SET RESI - Success Update Waybill Number "+booking_code+" With Order Code "+value.order_code
                                                }
                                            };
                                            // console.log(messageSuccess);
                                            res.json(messageSuccess);
                                        }
                                        else{
                                            messageError = {
                                                status : 500,
                                                message : "Failed Update Order",
                                                detail : {
                                                    data : "SET RESI - Failed Update Waybill Number With Order Code "+value.order_code
                                                }
                                            };
                                            // console.log(messageError);
                                            res.json(messageError);
                                        }
                                    }
                                    else{
                                        var body = {};
                                        let mappingCouriers = await findCourierByDelivryId(value.delivery_type_id, value.channel_id)
                                        if(mappingCouriers){
                                            mappingCouriers.forEach(async function(mappingCourier)
                                            {
                                                var courier_name = mappingCourier.courier_name.split(" ");
                                                var courier = "";
                                                var courier_type = "";
                                                if(courier_name[0] == "J&T")
                                                {
                                                    courier = "jnt";
                                                    courier_type = "pick up";
                                                }
                                                else if(courier_name[0] == "SiCepat")
                                                {
                                                    courier = "sicepat";
                                                    courier_type = "pick up";							
                                                }
                                                else if(courier_name[0] == "GO-SEND")
                                                {
                                                    courier = "go-jek";
                                                    courier_type = "pick up";
                                                }
                                                else if(courier_name[0] == "GoSend")
                                                {
                                                    courier = "go-jek";
                                                    courier_type = "pick up";
                                                }
                                                else if(courier_name[0] == "Grab")
                                                {
                                                    courier = "grab";
                                                    courier_type = "pick up";
                                                }
                                                else if(courier_name[0] == "NINJA")
                                                {
                                                    courier = "ninjavan";
                                                    courier_type = "pick up";
                                                }
                                                else if(courier_name[0] == "JNE")
                                                {
                                                    courier = "jne";
                                                    courier_type = "drop off cashless";
                                                }
                                                else if(courier_name[0] == "Pos")
                                                {
                                                    courier = "pos";
                                                    courier_type = "drop off";
                                                }
                                                else if(courier_name[0] == "Lion")
                                                {
                                                    courier = "lionparcel";
                                                    courier_type = "pick up";
                                                }
                                                else
                                                {
                                                    courier = res_courier.courier_name;
                                                    courier_type = res_courier.service_type;
                                                }                     
                                                
                                                body = {
                                                    transaction_id   : value.ref_order_id,
                                                    courier_selection: courier,
                                                    service_type     : courier_type
                                                };
                                                
                                                var axios = require('axios');
                                                var config = {
                                                    method: 'POST',
                                                    url   : "https://api.bukalapak.com/_partners/logistic-bookings",
                                                    headers: { 
                                                        'Content-type': 'application/json', 
                                                        'Authorization': 'Bearer '+rest.salt,
                                                        'User-Agent'  : 'Bukalapak/TUA(Partner;AjwmqBUcIHXPBNiSEIXbAQwuYSZULHkL;+https://www.bukalapak.com)'
                                                    },
                                                    data  : body,
                                                    validateStatus: () => true
                                                };
                                                axios(config)
                                                .then(async (responsePick)=> 
                                                {
                                                    var resPick = responsePick.data;
                                                    if(responseSo.status == 200)
                                                    {
                                                        booking_code = resPick.delivery.tracking_number;
                                                        let updateCobHeader = await updateAwbByOrderHeaderId(booking_code,value.order_header_id);
                                                        if(updateCobHeader)
                                                        { 
                                                            messageSuccess = {
                                                                status : 200,
                                                                message : "Success Create Order",
                                                                detail : {
                                                                    data : "SET RESI - Success Update Waybill Number "+booking_code+" With Order Code "+value.order_code
                                                                }
                                                            };
                                                            // console.log(messageSuccess);
                                                            res.json(messageSuccess);
                                                        }
                                                        else{
                                                            messageError = {
                                                                status : 500,
                                                                message : "Failed Update Order",
                                                                detail : {
                                                                    data : "SET RESI - Failed Update Waybill Number With Order Code "+value.order_code
                                                                }
                                                            };
                                                            // console.log(messageError);
                                                            res.json(messageError);
                                                        }
                                                    }
                                                    else{
                                                        messageError = {
                                                            status : response.meta.http_status,
                                                            message: response.errors[0].message,
                                                            detail : response.errors
                                                        };
                                                        // console.log(messageError);
                                                        res.json(messageError);
                                                    }
                                                });
                                            });
                                        }
                                        else{
                                            messageError = {
                                                status : 500,
                                                message : "Failed Cek Mapping",
                                                detail : {
                                                    data : "SET RESI - Delivery Id"+value.delivery_type_id+" Not mapping in courier channel"
                                                }
                                            };
                                            // console.log(messageError);
                                            res.json(messageError);
                                        }
                                    }
                                });
                            }
                            else{
                                messageError = {
                                    status : response.meta.http_status,
                                    message: response.errors[0].message,
                                    detail : response.errors
                                };
                                // console.log(messageError);
                                res.json(messageError);
                            }
                        })
                        .catch(function (error) 
                        {
                            res.json({
                                status : false,
                                message: "failed",
                                data   : "Server error"
                            });
                        });
                    });
                }
                else{
                    messageError = {
                        status : 500,
                        message: "FAILED GET ORDER",
                        detail : "SET RESI - Order With Status Packed Not Found"
                    };
                    // console.log(messageError);
                    res.json(messageError);
                }
            });
        }
        else{
            messageError = {
                status : 500,
                message: "FAILED GET CLIENT",
                detail : "SET RESI - FAILED TO GET CLIENT BECAUSE "+shopName+" NOT FOUND IN SHOP CONFIGURATION"
            };
            // console.log(messageError);
            res.json(messageError);
        }
    }
    catch (error) 
    {
        res.json({
            status : false,
            message: "failed",
            data   : "Server error"
        });
    }
}

async function acceptOrder(req,res,next)
{
    try
    {
        var messageSuccess = {};
        var messageError = {};

        const shopconfigs = await conn_pg.query("SELECT shop.client_id, shop.channel_id, shop.shop_configuration_id, shop.shop_id, shop.shop_name, shop.fs_id, shop.client_code, shop.client_secret, shop.token, shop.salt, cl.code AS clientCode, cl.multi_channel, ch.name FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id = shop.client_id LEFT JOIN channel ch ON shop.channel_id = ch.channel_id WHERE ch.name = 'BUKALAPAK' AND shop.active = 1 AND shop.accept_order = 1");
        if(shopconfigs.rowCount > 0){
            var configs = shopconfigs.rows;
            configs.forEach(async function(rest)
            {
                var shopConfigId = rest.shop_configuration_id;
                var channelName = rest.name;
                let cekOrders = await getOrdersAwbPacked(channelName,shopConfigId);
                if(cekOrders){
                    cekOrders.forEach(async function(value)
                    {
                        var payload = {
                            state : "accepted"
                        };
                        var axios = require('axios');
                        var config = {
                            method: 'PUT',
                            url   : 'https://api.bukalapak.com/transactions/'+value.ref_order_id+'/status',
                            headers: { 
                                'Content-type': 'application/json', 
                                'Authorization': 'Bearer '+rest.salt,
                                'User-Agent'  : 'Bukalapak/TUA(Partner;AjwmqBUcIHXPBNiSEIXbAQwuYSZULHkL;+https://www.bukalapak.com)'
                            },
                            data  : payload,
                            validateStatus: () => true
                        };
                        axios(config)
                        .then(async (response)=> 
                        {
                            var datas = response.data;
                            if(response.meta.http_status == 200)
                            {
                                messageSuccess = {
                                    status : 200,
                                    message : "Success Accpeted Order",
                                    detail : response.success
                                };
                                // console.log(messageSuccess);
                                res.json(messageSuccess);
                            }
                            else{
                                messageError = {
                                    status : response.meta.http_status,
                                    message: response.errors[0].message,
                                    detail : response.errors
                                };
                                // console.log(messageError);
                                res.json(messageError);
                            }
                        })
                        .catch(function (error) 
                        {
                            res.json({
                                status : false,
                                message: "failed",
                                data   : "Server error"
                            });
                        });
                    });
                }
                else{
                    messageError = {
                        status : 500,
                        message: "FAILED GET ORDER",
                        detail : "SET RESI - Order With Status Packed Not Found"
                    };
                    // console.log(messageError);
                    res.json(messageError);
                }
            });
        }
        else{
            messageError = {
                status : 500,
                message: "FAILED GET CLIENT",
                detail : "SET RESI - FAILED TO GET CLIENT BECAUSE "+shopName+" NOT FOUND IN SHOP CONFIGURATION"
            };
            // console.log(messageError);
            res.json(messageError);
        }
    }
    catch (error) 
    {
        res.json({
            status : false,
            message: "failed",
            data   : "Server error"
        });
    }
}

async function updateStock(req,res,next)
{
    try
    {
        var messageSuccess = {};
        var messageError   = {};
        var validation     = null;
        var apiKey         = req.body.apikey;
        var itemId         = req.body.item_id;
        var stock          = req.body.stock;
        
        if(!apiKey)
        { 
            validation = {
                "status" : 500,
                "message": 'failed',
                "data"   : 'Item Code Must Be Declare'
            }; 
        }
        else
        {
            if(apiKey == "")
            {
                validation = {
                    "status" : 500,
                    "message": 'failed',
                    "data"   : 'Item Code Cannot Be Empty'
                }; 
            }
        }
        
        if(!itemId)
        { 
            validation = {
                "status" : 500,
                "message": 'failed',
                "data"   : 'Adjustment Type Must Be Declare'
            }; 
        }
        else
        {
            if(itemId == "")
            {
                validation = {
                    "status" : 500,
                    "message": 'failed',
                    "data"   : 'Adjustment Type Cannot Be Empty'
                }; 
            }
        }
        
        if(!stock)
        { 
            validation = {
                "status" : 500,
                "message": 'failed',
                "data"   : 'Location Code Must Be Declare'
            }; 
        }
        else
        {
            if(stock == "")
            {
                validation = {
                    "status" : 500,
                    "message": 'failed',
                    "data"   : 'Location Code Cannot Be Empty'
                }; 
            }
        }

        if(!validation)
        {
            const shopconfigs = await conn_pg.query("SELECT shop.shop_id,shop.shop_configuration_id,cl.name AS client,shop.salt FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id=shop.client_id LEFT JOIN channel ch ON shop.channel_id=ch.channel_id WHERE ch.name='BUKALAPAK' and shop.update_stock=1 AND cl.api_key = $1",[apiKey]);
            if(shopconfigs.rowCount > 0){
                var configs = shopconfigs.rows;
                configs.forEach(async function(rest)
                {
                    if(rest.shop_id == 'client_credentials')
                    {
                        var shopConfigId = rest.shop_configuration_id;
                        var channelName = rest.name;
                        let values = await checkMappingById(itemId,shopConfigId);
                        if(values){
                            values.forEach(async function(value)
                            {
                                var curl_post_data = {
                                    stock: stock,
                                    state: 'active'
                                };
                                var axios = require('axios');
                                var config = {
                                    method: 'PATCH',
                                    url   : 'https://api.bukalapak.com/products/'+value.product_code+'/skus/'+value.product_id+'?access_token='+program.salt,
                                    headers: { 
                                        'Content-type': 'application/json',
                                        'User-Agent'  : 'Bukalapak/TUA(Partner;AjwmqBUcIHXPBNiSEIXbAQwuYSZULHkL;+https://www.bukalapak.com)'
                                    },
                                    data : curl_post_data, 
                                    validateStatus: () => true
                                };
                                axios(config)
                                .then(async (response)=> 
                                {
                                    var datas = response.data;
                                    if(response.meta.http_status == 200)
                                    {
                                        messageSuccess = {
                                            status : 200,
                                            message : "Success Accpeted Order",
                                            detail : response.success
                                        };
                                        // console.log(messageSuccess);
                                        res.json(messageSuccess);
                                    }
                                    else{
                                        messageError = {
                                            status : response.meta.http_status,
                                            message: response.errors[0].message,
                                            detail : response.errors
                                        };
                                        // console.log(messageError);
                                        res.json(messageError);
                                    }
                                })
                                .catch(function (error) 
                                {
                                    res.json({
                                        status : false,
                                        message: "failed",
                                        data   : "Server error"
                                    });
                                });
                            });
                        }
                        else{
                            messageError = {
                                status : 500,
                                message: "FAILED GET ORDER",
                                detail : "SET RESI - Order With Status Packed Not Found"
                            };
                            // console.log(messageError);
                            res.json(messageError);
                        }
                    }
                });
            }
            else{
                messageError = {
                    status : 500,
                    message: "FAILED GET CLIENT",
                    detail : "SET RESI - FAILED TO GET CLIENT BECAUSE "+shopName+" NOT FOUND IN SHOP CONFIGURATION"
                };
                // console.log(messageError);
                res.json(messageError);
            }
        }
        else{
            // console.log(validation);
            res.json(validation);
        }
    }
    catch (error) 
    {
        res.json({
            status : false,
            message: "failed",
            data   : "Server error"
        });
    }
}

//store
async function storeOrders(orderCode, clientId, channelId, shopConfigurationId, stockTypeId, orderTypeId, deliveryTypeId, locationId, refOrderId, bookingNumber, waybillNumber, totalPrice, recipientName, recipientPhone, recipientAddress, recipientEmail, recipientDistrict, recipientCity, recipientProvince, recipientCountry, recipientPostalCode, timeStamp, totalProductPrice, discount, shippingPrice, paymentId, codPrice, remarks, shopName, stockSource, items)
{
    let pg = await conn_pg.connect();
    try {    
        await pg.query('BEGIN')
        var statusId = 70;
        var createdName = "Automatic By System API";
        let orderheaders = await pg.query("INSERT INTO orderheader(order_code, location_id, client_id, shop_configuration_id, status_id, delivery_type_id, payment_type_id, channel_id, stock_type_id, order_type_id, ref_order_id, code, order_date, booking_number, waybill_number, recipient_name, recipient_phone, recipient_email, recipient_address, recipient_district, recipient_city, recipient_province, recipient_country, recipient_postal_code, latitude, longitude, total_koli, shipping_price, total_price, cod_price, dfod_price, stock_source, remark, created_date, modified_date, created_by, modified_by, created_name, store_name, discount, total_product_price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, 0, 0, 0, $25, $26, $27, 0, $28, $29, NOW(), NOW(), 0, 0, $30, $31, $32, $33) RETURNING order_header_id, status_id",[orderCode, locationId, clientId, shopConfigurationId, statusId, deliveryTypeId, paymentId, channelId, stockTypeId, orderTypeId, refOrderId, orderCode, timeStamp, bookingNumber, waybillNumber, recipientName, recipientPhone, recipientEmail, recipientAddress, recipientDistrict, recipientCity, recipientProvince, recipientCountry, recipientPostalCode, shippingPrice, totalPrice, codPrice, stockSource, remarks, createdName, shopName, discount, totalProductPrice]);
        var datas = orderheaders.rows;
        if(orderheaders.rowCount > 0)
        {
            datas.forEach(async function(orderHeader)
            {      
                let jobpushorders = await pg.query("INSERT INTO jobpushorder(order_header_id, created_date) VALUES($1, NOW())",[orderHeader.order_header_id]);
                if(jobpushorders.rowCount > 0)
                {
                    let orderhistorys = await pg.query("INSERT INTO orderhistory(order_header_id, status_id, updated_by, update_date, created_date, created_by, modified_by) VALUES ($1, $2, $3, NOW(), NOW(), 0, 0)",[orderHeader.order_header_id, orderHeader.status_id, createdName]);
                    if(orderhistorys.rowCount > 0)
                    {
                        items.forEach(async function(item)
                        {            
                            var variants    = item.stuff.sku_name;
                            let isInMappings = await checkMappingVariant(variants,shopConfigurationId);   
                            if(isInMappings)   
                            {  
                                isInMappings.forEach(async function(isInMapping)
                                {  
                                    if(isInMapping.item_id != null)
                                    {
                                        // var sku         = item.product.id;
                                        var unitWeight     = parseInt(item.stuff.product.weight);
                                        var unitPrice      = parseInt(item.price);
                                        var totalUnitPrice = parseInt(item.total_price);
                                        var orderQuantity  = parseInt(item.quantity);
                                        let insertDetails = await pg.query("INSERT INTO orderdetail(order_code, order_header_id, item_id, order_quantity, unit_price, total_unit_price, unit_weight, status_id, created_date, modified_date, created_by, modified_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), 0, 0)",[orderCode, orderHeader.order_header_id, isInMapping.item_id, orderQuantity, unitPrice, totalUnitPrice, unitWeight, orderHeader.status_id]);
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
                                        }
                                        else{                                                
                                            await pg.query('ROLLBACK')
                                        }
                                    }
                                    else
                                    {
                                        await pg.query('ROLLBACK')
                                        messageError = {
                                            status : 500,
                                            message : "Item Not Mapping",
                                            detail : {
                                                data : "GET ORDERS - Itemcode "+variants+" Not Mapping Item_id"
                                            }
                                        };
                                        return messageError;
                                    }
                                });
                            }
                            else
                            {
                                await pg.query('ROLLBACK')
                                messageError = {
                                    status : 500,
                                    message : "Item Not Mapping",
                                    detail : {
                                        data : "GET ORDERS - Itemcode "+variants+" Not Mapping"
                                    }
                                };
                                return messageError;
                            }
                        });
                    }
                    else{
                        await pg.query('ROLLBACK')
                    }
                }
                else{
                    await pg.query('ROLLBACK')
                }
            });
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

//function cek data

async function checkShopLocation(shopConfigId)
{
    let sql = await conn_pg.query("SELECT sl.location_channel, l.name, l.code, l.location_id FROM shoplocation sl LEFT JOIN location l ON sl.location_id = l.location_id WHERE sl.shop_configuration_id = $1",[shopConfigId]);
    var results = sql.rows;
    if(sql.rowCount > 0)
    {
        return results;
    }
}

async function checkOrderCode(orderCode)
{
    var resIsInOrders = "";
    let res_isInOrder = await conn_pg.query("SELECT order_header_id, ref_order_id, shop_configuration_id, code, order_code FROM orderheader WHERE order_code = $1",[orderCode]);
    var resIsInOrders = res_isInOrder.rows;
    if(res_isInOrder.rowCount > 0)
    {
        return resIsInOrders;
    }
}

async function getOrdersAwbPacked(channelName,shopConfigId)
{
    let sql = await conn_pg.query("SELECT a.order_header_id,a.ref_order_id, a.code AS order_code, a.delivery_type_id, a.channel_id, d.salt FROM orderheader a LEFT JOIN channel b ON a.channel_id = b.channel_id LEFT JOIN status c ON a.status_id = c.status_id LEFT JOIN shopconfiguration d ON a.shop_configuration_id = d.shop_configuration_id WHERE c.code IN ('ORD_PACKED') AND (a.waybill_number isnull OR a.waybill_number = '') AND (d.salt IS NOT NULL AND a.ref_order_id != '') AND a.shop_configuration_id = $1 AND b.name = $2",[shopConfigId, channelName]);
    var results = sql.rows;
    if(sql.rowCount > 0)
    {
        results.forEach(function(result)
        {  
            return result;
        });
    }
}

async function checkMappingVariant(variantId, shopConfigId)
{
    let result_mapping = await conn_pg.query("SELECT item_id,product_code,product_name,variant_id FROM mappingitem WHERE variant_id = $1 AND shop_configuration_id = $2", [variantId,shopConfigId]);
    var checkMappingItems = result_mapping.rows;
    if(result_mapping.rowCount > 0)
    {
        return checkMappingItems;
    }
}

async function checkMappingById(itemId, shopConfigId)
{
    let result_mapping = await conn_pg.query("SELECT product_code, product_id, item_id FROM mappingitem WHERE item_id = $1 AND shop_configuration_id = $2", [itemId,shopConfigId]);
    var checkMappingItems = result_mapping.rows;
    if(result_mapping.rowCount > 0)
    {
        return checkMappingItems;
    }
}

async function findCourier(courier, channelName)
{
    // console.log(channelName);
    let selectCourier = await conn_pg.query("SELECT dt.delivery_type_id, mc.courier_name as shipping_method, dt.name as shipping_type, c.name, ch.name as channel_name FROM mappingcourier mc LEFT JOIN deliverytype dt ON mc.delivery_type_id=dt.delivery_type_id LEFT JOIN courier c ON dt.courier_id=c.courier_id LEFT JOIN channel ch ON mc.channel_id=ch.channel_id WHERE mc.courier_name = $1 AND ch.name = $2", [courier,channelName]);
    var Courier = selectCourier.rows;
    if(selectCourier.rowCount > 0)
    {
        return Courier;
    }
}

async function findCourierByDelivryId(delivryId, channelId)
{
    // console.log(channelName);
    let selectCourier = await conn_pg.query("SELECT a.courier_name,a.service_type FROM deliverytype a LEFT JOIN mappingcourier b ON a.delivery_type_id = b.delivery_type_id WHERE a.delivery_type_id = $1 AND b.channel_id = $2", [delivryId,channelId]);
    var Courier = selectCourier.rows;
    if(selectCourier.rowCount > 0)
    {
        return Courier;
    }
}

async function checkStockType(clientId,stockType)
{
    var restockTypes = "";
    let res_stockType = await conn_pg.query("SELECT stock_type_id FROM stocktype WHERE client_id = $1 AND name = $2",[clientId,stockType]);
    restockTypes = res_stockType.rows;
    if(res_stockType.rowCount > 0)
    {
        return restockTypes;
    }
}

//insert
async function insertIntoMappingItem(itemId,shopConfigurationId,skuId,productId,name,url,sku)
{
  let data = await conn_pg.query("INSERT INTO mappingitem (item_id, shop_configuration_id, product_id, product_code, product_name, product_url, variant_id, active, created_date, modified_date, created_by, modified_by) values ($1, $2, $3, $4, $5, $6, $7, 1, NOW(), NOW(), 0, 0)",[itemId,shopConfigurationId,skuId,productId,name,url,sku]);
  insertData = data.rows;
  if(data.rowCount > 0)
  {
      return insertData;
  }
}

async function insertIntoMappingItemWithNullItemId(shopConfigurationId,skuId,productId,name,url,sku)
{
    let data = await conn_pg.query("INSERT INTO mappingitem (shop_configuration_id, product_id, product_code, product_name, product_url, variant_id, active, created_date, modified_date, created_by, modified_by) values ($1, $2, $3, $4, $5, $6, 1, NOW(), NOW(), 0, 0)",[shopConfigurationId,skuId,productId,name,url,sku]);
    insertData = data.rows;
    if(data.rowCount > 0)
    {
        return insertData;
    }
}

async function updateMappingItemByVariantAndShop(item_id, itemCode, variantId, shop_configuration_id)
{
  let data = await conn_pg.query("UPDATE mappingitem SET item_id = $1, product_code = $2 WHERE variant_id = $3 AND shop_configuration_id = $4",[item_id,itemCode,variantId,shop_configuration_id]);
  updateData = data.rows;
  if(data.rowCount > 0)
  {
      return updateData;
  }
}

async function updateAwbByOrderHeaderId(awbNumber,headerId)
{
    let updateResi = await conn_pg.query("UPDATE orderheader SET waybill_number = $1 WHERE order_header_id = $2",[awbNumber,headerId]);
    updateCob = updateResi.rows;
    if(updateResi.rowCount > 0)
    {
        return updateCob;
    }
}

//setDate
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

module.exports ={
    getToken,
    getRefreshToken,
    getProduct,
    getOrders,
    getCob,
    acceptOrder,
    updateStock
}