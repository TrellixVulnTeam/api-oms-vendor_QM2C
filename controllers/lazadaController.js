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
const fs = require('fs');
const LazadaAPI = require('lazada-open-platform-sdk');

//https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=https://flux.anteraja.id/&client_id=109736
async function getToken (req,res,next) 
{
    try
    {
        var messageSuccess = {};
        var messageError = {};

        const configs = await conn_pg.query("SELECT cl.client_id, shop.shop_configuration_id, shop.shop_id, shop.shop_name, shop.fs_id, shop.client_code, shop.client_secret, shop.token FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id = shop.client_id LEFT JOIN channel ch ON shop.channel_id = ch.channel_id WHERE ch.name = 'LAZADA' AND shop.active = 1");
        if(configs.rowCount > 0){
            var shops = configs.rows;
            shops.forEach(async function(shop)
            {
                // console.log(shop);
                var countryCode = 'INDONESIA';
                const authCode = shop.fs_id;
                var appSecret = shop.client_code;
                var url = 'https://auth.lazada.com/rest';
                var appKey = shop.shop_id;
                
                const aLazadaAPI = new LazadaAPI(appKey, appSecret, countryCode)
                const params = {
                    code: authCode,
                }
                const val = aLazadaAPI.generateAccessToken(params)
                .then(async (response) => {
                        var remainingExpireInDay = response.expires_in / 86400;
                        var newAccessToken = response.access_token;
                        var newRefreshToken = response.refresh_token;
                        var date = new Date();
                        date.getDate(date.setDate(date.getDate() + remainingExpireInDay));
                        var dates = new Date(date);
                        let month = await setMonth(dates.getMonth());
                        var expiresIn = dates.getFullYear()+"-"+month+"-"+dates.getDate()+" "+dates.getHours()+":"+dates.getMinutes()+":"+dates.getSeconds();
                        
                        let update = await conn_pg.query("UPDATE shopconfiguration SET token = $1, client_secret = $2, expires_in = $3 WHERE shop_configuration_id = $4", [newAccessToken,newRefreshToken,expiresIn,shop.shop_configuration_id]);
                        if(update.rowCount > 0)
                        {
                            res.json({
                                status : 200,
                                message: "OK",
                                data   : "LAZADA AUTH - SUCCESSFULLY GENERATE TOKEN FOR THIS SHOP "+shop.shop_name
                            });
                        }
                        else
                        {
                            res.json({
                                status : 500,
                                message: "FAILED",
                                data   : "LAZADA AUTH - FAILED TO GET TOKEN FOR THIS SHOP "+shop.shop_name
                            });
                        }
                    }
                )
                .catch(
                    error => console.log(
                        JSON.stringify(error, null, 4)
                    )
                )
            });
        }
        else{
            messageError = {
                status : 500,
                message: "FAILED GET CLIENT",
                detail : "SET TOKEN - FAILED TO GET CLIENT BECAUSE "+shopName+" NOT FOUND IN SHOP CONFIGURATION"
            };
            console.log(messageError);
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
        const configs = await conn_pg.query("SELECT cl.client_id, shop.shop_configuration_id, shop.shop_id, shop.shop_name, shop.fs_id, shop.client_code, shop.client_secret, shop.token FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id = shop.client_id LEFT JOIN channel ch ON shop.channel_id = ch.channel_id WHERE ch.name = 'LAZADA' AND shop.active = 1");
        if(configs.rowCount > 0){
            var shops = configs.rows;
            shops.forEach(async function(shop)
            {
                // console.log(shop);
                var countryCode = 'INDONESIA';
                const authCode = shop.fs_id;
                var appSecret = shop.client_code;
                var url = 'https://auth.lazada.com/rest';
                var appKey = shop.shop_id;
                var refresCode = shop.client_secret;
                
                const aLazadaAPI = new LazadaAPI(appKey, appSecret, countryCode)
                // console.log(aLazadaAPI);
                const params = {
                    refresh_token: refresCode,
                }
                const val = aLazadaAPI.refreshAccessToken(params)
                .then(async (response) => {
                        var remainingExpireInDay = response.expires_in / 86400;
                        var newRefreshToken = response.refresh_token;
                        var date = new Date();
                        date.getDate(date.setDate(date.getDate() + remainingExpireInDay));
                        var dates = new Date(date);
                        let month = await setMonth(dates.getMonth());
                        var expiresIn = dates.getFullYear()+"-"+month+"-"+dates.getDate()+" "+dates.getHours()+":"+dates.getMinutes()+":"+dates.getSeconds();
                        
                        let update = await conn_pg.query("UPDATE shopconfiguration SET client_secret = $1, expires_in = $2 WHERE shop_configuration_id = $3", [newRefreshToken,expiresIn,shop.shop_configuration_id]);
                        if(update.rowCount > 0)
                        {
                            res.json({
                                status : 200,
                                message: "OK",
                                data   : "LAZADA AUTH - SUCCESSFULLY REFRESH TOKEN FOR THIS SHOP "+shop.shop_name
                            });
                        }
                        else
                        {
                            res.json({
                                status : 500,
                                message: "FAILED",
                                data   : "LAZADA AUTH - FAILED TO GET TOKEN FOR THIS SHOP "+shop.shop_name
                            });
                        }
                    }
                )
                .catch(
                    error => console.log(
                        JSON.stringify(error, null, 4)
                    )
                )
            });
        }
        else{
            messageError = {
                status : 500,
                message: "FAILED GET CLIENT",
                detail : "SET TOKEN - FAILED TO GET CLIENT BECAUSE "+shopName+" NOT FOUND IN SHOP CONFIGURATION"
            };
            console.log(messageError);
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
        const shopconfigs = await conn_pg.query("SELECT shop.client_id, shop.shop_configuration_id, shop.shop_id, shop.shop_name, shop.fs_id, shop.client_code, shop.client_secret, shop.token, shop.salt FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id = shop.client_id LEFT JOIN channel ch ON shop.channel_id = ch.channel_id WHERE ch.name = 'LAZADA' AND shop.active = 1 AND shop.sync_product = 1");
        if(shopconfigs.rowCount > 0){
            var configs = shopconfigs.rows;
            configs.forEach(async function(shop)
            {
                var countryCode = 'INDONESIA';
                const authCode = shop.fs_id;
                var appSecret = shop.client_code;
                var url = 'https://auth.lazada.com/rest';
                var appKey = shop.shop_id;
                var token = shop.token;
                var paginationOffsetEntry = 50;
                var date = new Date();
                let month = await setMonth(date.getMonth());
                var expiresIn = date.getFullYear()+"-"+month+"-"+date.getDate()+"T"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"+00:00";
                
                // console.log(expiresIn);
                const aLazadaAPI = new LazadaAPI(appKey, appSecret, countryCode, token)
                const params = {
                    // create_after:expiresIn,
                    // update_after:expiresIn,
                    filter : 'all',
                    offset : 0,
                    limit  : paginationOffsetEntry,
                    options: 1
                }
                const val = aLazadaAPI.getProducts(params)
                .then(async (response) => {
                    if (response.code == "0")
                    {
                        var totalPages =  Math.ceil(response.data.total_products / 100);
                        var allProducts = response.data.products;
                        var page = 1;
                        do {
                            if (page <= totalPages) {
                                var paginationOffset = page * paginationOffsetEntry;
                                const val = aLazadaAPI.getProducts({
                                    // create_after:expiresIn,
                                    // update_after:expiresIn,
                                    filter : 'all',
                                    offset : paginationOffset + 1,
                                    limit  : paginationOffsetEntry,
                                    options: 1
                                })
                                .then(async (response2)=> 
                                {
                                    var nextArrayProductHeader = response2.data.products;
                                    allProducts = arrayUnique(allProducts.concat(nextArrayProductHeader));
                                })
                                .catch(
                                    error => console.log(
                                        JSON.stringify(error, null, 4)
                                    )
                                )
                            } else {
                                break;
                            }
                            page++
                        } while (page <= totalPages);

                        allProducts.forEach(async function(product){
                            var itemProductName = product.attributes.name;
                            var itemProductId = product.item_id;
                            product.skus.forEach(async function(variant){
                                var codeReplace = variant.SellerSku.replace('/\t+/', '');
                                var codeTrim = codeReplace.trim();
                                var itemVariantId = codeTrim.toUpperCase();
                                var itemProductCode = variant.SkuId;
                                var itemProductUrl = 'https://api.lazada.co.id/rest/products/get';
                                
                                // Check In Mapping Item
                                let resultMappings = await conn_pg.query("SELECT mapping_item FROM mappingitem WHERE variant_id = $1 AND shop_configuration_id = $2", [itemVariantId,shop.shop_configuration_id]);
                                var resultMapping = resultMappings.rows;
                                if(resultMappings.rowCount == 0)
                                {
                                    // Check In Master Item
                                    let resultItems = await conn_pg.query("SELECT item_id FROM item WHERE code = $1 AND client_id = $2", [itemProductCode,shop.client_id]);
                                    var resultItem = resultItems.rows;
                                    if(resultItems.rowCount > 0)
                                    {
                                        resultItem.forEach(function(chekItem)
                                        {  
                                            let insert = insertIntoMappingItem(chekItem.item_id, shop.shop_configuration_id, itemProductId, itemProductCode, itemProductName, itemProductUrl, itemVariantId);
                                            if(insert)
                                            {
                                                messageSuccess = {
                                                    shop_configuration_id : shop.shop_configuration_id,
                                                    shop_name : shop.shop_name,
                                                    sku : itemProductCode,
                                                    variant_id : itemVariantId,
                                                    success : true,
                                                    message : 'SYNC PRODUCT - SUCCESSFULLY MAPPING FOR THIS SKU '+itemProductCode+' IN CHANNEL LAZADA'
                                                };
                                                
                                                res.json(messageSuccess);
                                            }
                                        });
                                    }
                                    else
                                    {
                                        let insert = insertIntoMappingItemWithNullItemId(shop.shop_configuration_id, itemProductId, itemProductCode, itemProductName, itemProductUrl, itemVariantId);
                                        if(insert)
                                        {
                                            messageSuccess = {
                                                shop_configuration_id : shop.shop_configuration_id,
                                                shop_name : shop.shop_name,
                                                sku : itemProductCode,
                                                variant_id : itemVariantId,
                                                success : false,
                                                message : 'SYNC PRODUCT - MAPPING TO CHANNEL LAZADA WITH NULL ITEM ID FOR THIS PRODUCT SKU : '+itemProductCode+', VARIANTID : '+itemVariantId+' BECAUSE NO REFERENCE FOUND IN MASTER ITEM'
                                            };
                                            // res.json(messageSuccess);
                                            console.log(messageSuccess);
                                        }
                                    }
                                }
                                else{
                                    // Check Mapping Item Null In Mapping
                                    let resultMappingItemNulls = await conn_pg.query("SELECT mapping_item,variant_id FROM mappingitem WHERE item_id is null AND variant_id = $1 AND shop_configuration_id = $2", [itemVariantId,shop.shop_configuration_id]);
                                    var resultMappingItemNull = resultMappingItemNulls.rows;
                                    if(resultMappings.rowCount > 0)
                                    {
                                        resultMappingItemNull.forEach(async function(mappingItemNull){
                                            // console.log(mappingItemNull);
                                            if(mappingItemNull){
                                                // Check In Master Item
                                                let resultItems = await conn_pg.query("SELECT item_id FROM item WHERE code = $1 AND client_id = $2", [itemProductCode,shop.client_id]);
                                                var resultItem = resultItems.rows;
                                                if(resultItems.rowCount > 0)
                                                {
                                                    resultItem.forEach(function(chekItem)
                                                    {  
                                                        var update = updateMappingItemByVariantAndShop(chekItem.item_id, itemProductCode, mappingItemNull.mapping_item);
                                                        if(update)
                                                        {
                                                            messageSuccess = {
                                                                shop_configuration_id : shop.shop_configuration_id,
                                                                shop_name : shop.shop_name,
                                                                sku : itemProductCode,
                                                                variant_id : itemVariantId,
                                                                success : true,
                                                                message : 'SYNC PRODUCT - SUCCESSFULLY MAPPING FOR THIS SKU '+itemProductCode+' IN CHANNEL LAZADA'
                                                            };
                                                            console.log(messageSuccess);
                                                            // res.json({messageSuccess});
                                                            // res.json(messageSuccess);
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                    else
                                    {
                                        messageSuccess = {
                                            shop_configuration_id : shop.shop_configuration_id,
                                            shop_name : shop.shop_name,
                                            sku : itemProductCode,
                                            variant_id : itemVariantId,
                                            success : true,
                                            message : 'SYNC PRODUCT - THIS SKU '+itemProductCode+' HAS ALREADY MAPPING WITH CHANNEL LAZADA'
                                        };
                                        console.log(messageSuccess);  
                                    }
                                }
                            });
                        });
                    }
                    else
                    {
                        messageError = {
                            shop_configuration_id : shop.shop_configuration_id,
                            shop_name : shop.shop_name,
                            success : false,
                            message : "SYNC PRODUCT - FAILED TO GET ALL PRODUCT FOR THIS SHOP "+shop.shop_name+" BECAUSE API ERROR"
                        };
                        console.log(messageError);                            
                    }
                })
                .catch(
                    error => console.log(
                        JSON.stringify(error, null, 4)
                    )
                )
            });
        }
        else{
            messageError = {
                status : 500,
                message: "FAILED GET CLIENT",
                detail : "SET TOKEN - FAILED TO GET CLIENT BECAUSE "+shop.shop_name+" NOT FOUND IN SHOP CONFIGURATION"
            };
            console.log(messageError);
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
    // console.log('oje')
    try
    {
        var messageSuccess = {};
        var messageError = {};

        const shopconfigs = await conn_pg.query("SELECT shop.client_id, shop.channel_id, shop.shop_configuration_id, cl.api_key, shop.shop_name, cl.multi_channel, shop.client_code, shop.token, shop.shop_id FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id = shop.client_id LEFT JOIN channel ch ON shop.channel_id = ch.channel_id WHERE ch.name = 'LAZADA' AND shop.active = 1 AND shop.get_order = 1");
        if(shopconfigs.rowCount > 0){
            var configs = shopconfigs.rows;
            configs.forEach(async function(shop)
            {
                var countryCode           = 'INDONESIA';
                var stockSource           = "GOOD STOCK";
                var appKey                = shop.shop_id;
                var clientId              = shop.client_id;
                var channelId             = shop.channel_id;
                var shopConfigId          = shop.shop_configuration_id;
                var apikey                = shop.api_key;
                var shopName              = shop.shop_name;
                var appSecret             = shop.client_code;
                var accessToken           = shop.token;
                var isMultiChannel        = shop.multi_channel;
                var paginationOffsetEntry = 50;
                var date                  = new Date();
                var befor                 = date.toISOString();
                date.setDate(date.getDate() - 3);
                let month = await setMonth(date.getMonth());
                var after = date.getFullYear()+"-"+month+"-"+date.getDate()+"T"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+".081Z";
                isMultiChannel == 1 ? stockType = 'MULTI CHANNEL' : stockType = 'LAZADA';

                // console.log(after);
                const aLazadaAPI = new LazadaAPI(appKey, appSecret, countryCode, accessToken)
                const params = {
                    created_before: befor,
                    created_after : after,
                    status        : 'pending',
                    offset        : 0,
                    limit         : paginationOffsetEntry,
                    sort_direction: 'DESC'
                }
                const val = aLazadaAPI.getOrders(params)
                .then(async (response) => {
                    if(response.code == 0)
                    {
                        // Get Total Page
                        var totalPages = 5;
                        var allOrders = response.data.orders;

                        // Get Another Order
                        for(page = 1; page < totalPages ; page++)
                        {
                            var paginationOffset = page * paginationOffsetEntry;
                            const val = aLazadaAPI.getOrders({
                                created_before: befor,
                                created_after : after,
                                status        : 'pending',
                                offset        : paginationOffset + 1,
                                limit         : paginationOffsetEntry,
                                sort_direction: 'DESC'
                            })
                            .then(async (response2)=> 
                            {
                                var nextArrayOrders = response2.data.orders;
                                allOrders = nextArrayOrders;
                                // allOrders = arrayUnique(allOrders.concat(nextArrayOrders));
                            })
                            .catch(
                                error => console.log(
                                    JSON.stringify(error, null, 4)
                                )
                            )
                        }
                        // console.log(allOrders);

                        if(allOrders)
                        {
                            allOrders.forEach(async function(orderHeader){                                
                                // var orderCode = orderHeader.order_number.toUpperCase();
                                var orderCode = orderHeader.order_number;  
                                let isInOrders = await checkOrderCode(orderCode);
                                if(!isInOrders)
                                {
                                    let checkMappingLocations = await checkShopLocation(shopConfigId);
                                    if(checkMappingLocations)
                                    {
                                        checkMappingLocations.forEach(async function(checkMappingLocation)
                                        {              
                                            const val = aLazadaAPI.getOrderItems({order_id: orderHeader.order_id.toString()})
                                            .then(async (orderItemsList)=> 
                                            {
                                                if(orderItemsList.code == '0')
                                                {
                                                    var totalDiscount = 0;
                                                    var CourierName = '';
                                                    var DeliveryTypeName = '';
                                                    var items = [];
                                                    orderItemsList.data.forEach(async function(orderItem){
                                                        if(orderItem.warehouse_code == 'dropshipping') // Get Only Order Dropshipping
                                                        {
                                                            var courierInfo = orderItem.shipping_provider_type.toUpperCase();
                                                            if (courierInfo == 'STANDARD')
                                                            {
                                                                CourierName      = 'LAZADA';
                                                                DeliveryTypeName = 'Standard';
                                                            }
                                                            else if (courierInfo == 'P2P')
                                                            {
                                                                CourierName      = 'LAZADA';
                                                                DeliveryTypeName = 'Instant';
                                                            }
                                                            else if (courierInfo == 'INSTANT')
                                                            {
                                                                CourierName      = 'LAZADA';
                                                                DeliveryTypeName = 'Instant';
                                                            }
                                                            else
                                                            {
                                                                CourierName      = 'LAZADA';
                                                                DeliveryTypeName = 'Standard';
                                                            }
                                                            items.push(orderItem);
                                                        }
                                                    });  
                                                    // console.log(DeliveryTypeName);

                                                    var timeStamp           = orderHeader.created_at.replace('+0700', " ");
                                                    var paymentType         = '';
                                                    var codPrice            = 0;
                                                    var locationId          = checkMappingLocation.location_id;
                                                    var refOrderId          = null;
                                                    orderHeader.payment_method == "COD" ? paymentType = "COD" : paymentType = "NON COD";
                                                    var orderTypeId         = 1;
                                                    var address = orderHeader.address_shipping.address1+" "+orderHeader.address_shipping.address5+' '+orderHeader.address_shipping.address4+' '+orderHeader.address_shipping.address3;
                                                    var recipientName       = orderHeader.address_shipping.first_name.toUpperCase();
                                                    var recipientPhone      = orderHeader.address_shipping.phone;
                                                    var recipientAddress    = address.toUpperCase();
                                                    var recipientEmail      = null;
                                                    var recipientDistrict   = orderHeader.address_shipping.address5.toUpperCase();
                                                    var recipientCity       = orderHeader.address_shipping.address4.toUpperCase();
                                                    var recipientProvince   = orderHeader.address_shipping.address3.toUpperCase();
                                                    var recipientCountry    = orderHeader.address_shipping.country.toUpperCase();
                                                    orderHeader.address_shipping.post_code == '' || orderHeader.address_shipping.post_code == NULL ? recipientPostalCode = '000000' : recipientPostalCode = orderHeader.address_shipping.post_code;
                                                    var shippingPrice       = orderHeader.shipping_fee;
                                                    var totalProductPrice   = 0;
                                                    var totalOrderPrice     = orderHeader.price;
                                                    var totalPrice          = (parseInt(totalOrderPrice) + shippingPrice) - totalDiscount;
                                                    var waybillNumber       = null;
                                                    var bookingNumber       = null;
                                                    var remarks             = orderHeader.remarks;
                                                    orderHeader.payment_method == "COD" ? paymentId = 1 : paymentId = 2;
                                                    paymentId == 1 ? codPrice = totalPrice : codPrice = 0;
                                                    let isCourierMapped = await findCourier(CourierName, DeliveryTypeName); 
                                                    if(isCourierMapped)
                                                    {
                                                        isCourierMapped.forEach(async function(CourierMapped)
                                                        {  
                                                            let isStockTypes = await checkStockType(clientId,stockType);
                                                            if(isStockTypes){
                                                                isStockTypes.forEach(async function(isStockType)
                                                                { 
                                                                    // console.log(orderCode);
                                                                    let callStore = await storeOrders(orderCode, clientId, channelId, shopConfigId, isStockType.stock_type_id, orderTypeId, CourierMapped.delivery_type_id, locationId, refOrderId, bookingNumber, waybillNumber, totalPrice, recipientName, recipientPhone, recipientAddress, recipientEmail, recipientDistrict, recipientCity, recipientProvince, recipientCountry, recipientPostalCode, timeStamp, totalProductPrice, totalDiscount, shippingPrice, paymentId, codPrice, remarks, shopName, stockSource, items);
                                                                    if(callStore)
                                                                    { 
                                                                        messageSuccess = {
                                                                            status : 200,
                                                                            message : "Success Create Order",
                                                                            detail : {
                                                                                data : "GET ORDERS - Order code "+orderCode+" has created header and detail successfully"
                                                                            }
                                                                        };
                                                                        console.log(messageSuccess);
                                                                        // res.json(messageSuccess);
                                                                    }
                                                                    else{
                                                                        messageError = {
                                                                            status : 500,
                                                                            message : "Failed Create Order",
                                                                            detail : {
                                                                                data : "GET ORDERS - Order code "+orderCode+" has created header and detail failed"
                                                                            }
                                                                        };
                                                                        console.log(messageError);
                                                                        // res.json(messageError);
                                                                    }
                                                                });
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
                                                        });
                                                    }
                                                    else{
                                                        messageError = {
                                                            shop_configuration_id : shopConfigId,
                                                            shop_name : shopName,
                                                            success : false,
                                                            message : "GET ORDER - COURIER "+CourierName+" TYPE "+DeliveryTypeName+" DOESNT HAS MAPPING"
                                                        };
                                                        console.log(messageError);
                                                    } 
                                                }
                                                else{
                                                    messageError = {
                                                        shop_configuration_id : shopConfigId,
                                                        shop_name : shopName,
                                                        success : false,
                                                        message : "GET ORDER - THIS SHOP "+shopName+"FAILED TO GET ORDER BECAUSE, "+orderList.message
                                                    };
                                                    console.log(messageError);
                                                }
                                            })
                                            .catch(
                                                error => console.log(
                                                    JSON.stringify(error, null, 4)
                                                )
                                            )
                                        });
                                    }
                                    else{
                                        messageError = {
                                            order_code : orderCode,
                                            shop_configuration_id : shopConfigId,
                                            shop_name : shopName,
                                            success : false,
                                            message : "GET ORDER - ORDERCODE "+orderCode+" FAILED TO CREATE, BECAUSE THIS SHOP "+shopName+" DOESNT HAS LOCATION THAT MAPPED TO LAZADA, PLEASE CREATE MAPPING LOCATION FIRST!"
                                        };
                                        console.log(messageError);   
                                    }
                                }
                                else{  
                                    messageError = {
                                        shop_configuration_id : shopConfigId,
                                        shop_name : shopName,
                                        success : false,
                                        message : "GET ORDER - ORDERS CODE "+orderCode+" ALREADY EXIST"
                                    };
                                    console.log(messageError);                                
                                }
                            })
                        }
                        else{
                            messageError = {
                                shop_configuration_id : shopConfigId,
                                shop_name : shopName,
                                success : false,
                                message : "GET ORDER - NO ORDERS FOUND FOR THIS SHOP "+shopName
                            };
                            console.log(messageError);
                        }
                    }
                    else{
                        messageError = {
                            shop_configuration_id : shopConfigId,
                            shop_name : shop.shop_name,
                            success : false,
                            message : "GET ORDER - THIS SHOP "+shopName+"FAILED TO GET ORDER BECAUSE, "+response.message
                        };
                        console.log(messageError);
                    }
                })
                .catch(
                    error => console.log(
                        JSON.stringify(error, null, 4)
                    )
                )
            });
        }
        else{
            messageError = {
                status : 500,
                message: "FAILED GET CLIENT",
                detail : "SET TOKEN - FAILED TO GET CLIENT BECAUSE "+shopName+" NOT FOUND IN SHOP CONFIGURATION"
            };
            console.log(messageError);
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
    var messageSuccess = {};
    var messageError   = {};
    var validation     = null;
    var shopName       = req.body.shop_name;
    var orderCode      = req.body.code;
    
    if(!shopName)
    { 
        validation = {
            "status" : 500,
            "message": 'failed',
            "data"   : 'Shop Name Must Be Declare'
        }; 
    }
    else
    {
        if(shopName == "")
        {
            validation = {
                "status" : 500,
                "message": 'failed',
                "data"   : 'Shop Name Cannot Be Empty'
            }; 
        }
    }
    
    if(!orderCode)
    { 
        validation = {
            "status" : 500,
            "message": 'failed',
            "data"   : 'Order Code Must Be Declare'
        }; 
    }
    else
    {
        if(orderCode == "")
        {
            validation = {
                "status" : 500,
                "message": 'failed',
                "data"   : 'Order Code Cannot Be Empty'
            }; 
        }
    }

    if(!validation)
    {
        const shopconfigs = await conn_pg.query("SELECT shop.shop_id, cl.client_id, shop.shop_configuration_id, cl.api_key, shop.shop_name, shop.get_resi, shop.client_code, shop.token, shop.accept_order FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id = shop.client_id LEFT JOIN channel ch ON shop.channel_id = ch.channel_id WHERE shop.shop_name = $1 AND shop.active = 1",[shopName]);
        if(shopconfigs.rowCount > 0){
            var configs = shopconfigs.rows;
            configs.forEach(async function(client)
            {
                var listOrderItemNo = [];
                var clientId = client.client_id;
                var shopConfigId = client.shop_configuration_id;
                var apikey = client.api_key;
                var shopName = client.shop_name;
                var isAcceptOrder = client.accept_order;
                var isGetResi = client.get_resi;
                var appSecret = client.client_code;
                var accessToken = client.token;
                var appKey = client.shop_id;
                var countryCode = 'INDONESIA';
                if (isAcceptOrder == 1 && isGetResi == 1)
                {
                    let orderData = await checkOrderCode(orderCode);
                    if(orderData){
                        // console.log(orderData);
                        orderData.forEach(async function(value)
                        {
                            const aLazadaAPI = new LazadaAPI(appKey, appSecret, countryCode, accessToken)
                            aLazadaAPI.getShipmentProviders()
                            .then(async (response) => {
                                if(response.code == 0)
                                {      
                                    // console.log(response.data.shipment_providers[0].name)
                                    aLazadaAPI.getOrderItems({order_id: value.code})
                                    .then(async (orderItems)=> 
                                    {
                                        if(orderItems.code == '0')
                                        {
                                            var orderItemIdsTemp = null;
                                            var rawCourier = null;
                                            orderItems.data.forEach(async function(items){
                                                if (items.warehouse_code == 'dropshipping')
                                                {
                                                    orderItemIdsTemp = items.order_item_id;
                                                    var len = ", ";
                                                    rawCourier = items.shipment_provider.substr(items.shipment_provider.indexOf(", ") + len.length);
                                                    if (orderItemIdsTemp)
                                                    {
                                                        listOrderItemNo.push(orderItemIdsTemp);
                                                    }
                                                }
                                            });
                                            
                                            let pg = await conn_pg.connect();
                                            try
                                            {
                                                await pg.query('BEGIN')
                                                var param = {
                                                    shipping_provider: response.data.shipment_providers[0].name,
                                                    delivery_type    : 'dropship',
                                                    order_item_ids   : JSON.stringify(listOrderItemNo)
                                                }
                                                aLazadaAPI.setStatusToPackedByMarketplace(param)
                                                .then(async (orderPacked)=> 
                                                {
                                                    if (orderPacked.code == '0')
                                                    {
                                                        let isCourierMapped = await findMappingCourier(orderPacked.data.order_items[0].shipment_provider, 'LAZADA'); 
                                                        if(isCourierMapped)
                                                        {
                                                            isCourierMapped.forEach(async function(CourierMapped)
                                                            {  
                                                                let data = await pg.query("UPDATE orderheader SET delivery_type_id = $1, waybill_number = $2 WHERE order_header_id = $3",[CourierMapped.delivery_type_id,orderPacked.data.order_items[0].tracking_number, value.order_header_id]);
                                                                updateData = data.rows;
                                                                if(data.rowCount > 0)
                                                                {
                                                                    await pg.query('COMMIT')
                                                                    messageSuccess = {
                                                                        status : 200,
                                                                        message : 'OK',
                                                                        detail : {
                                                                            data : 'SET FULFILLMENT - SUCCESSFULLY SET WAYBILL TO '+orderPacked.data.order_items[0].tracking_number+' FOR ORDERCODE '+orderCode+' AND SET COURIER TO '+orderPacked.data.order_items[0].shipment_provider,
                                                                            waybill : orderPacked.data.order_items[0].tracking_number,
                                                                            courier_name : CourierMapped.name,
                                                                            courier_service : CourierMapped.shipping_type
                                                                        }
                                                                    }
                                                                    console.log(messageSuccess);
                                                                }
                                                                else{
                                                                    await pg.query('ROLLBACK')
                                                                }
                                                            });
                                                        }
                                                        else{
                                                            messageError = {
                                                                status : 404,
                                                                message : 'NOT_FOUND',
                                                                detail : {
                                                                    data : 'SET FULFILLMENT - ORDERCODE '+orderCode+' FAILED TO UPDATE WAYBILL AND COURIER, BECAUSE '+orderPacked.data.order_items[0].shipment_provider+' NOT FOUND IN MAPPING COURIER'
                                                                }
                                                            };
                                                            console.log(messageError);
                                                        }
                                                    }
                                                })
                                                .catch(function (error) {
                                                    if(error.code == '120')
                                                    {
                                                        var leng = ": ";
                                                        correctCourier = rawCourier.substr(rawCourier.indexOf(": ") + leng.length);
                                                        var params = {
                                                            shipping_provider: correctCourier,
                                                            delivery_type    : 'dropship',
                                                            order_item_ids   : JSON.stringify(listOrderItemNo)
                                                        }
                                                        aLazadaAPI.setStatusToPackedByMarketplace(params)
                                                        .then(async (orderPackeds)=> 
                                                        {
                                                            if(orderPackeds.code == '0')
                                                            {
                                                                let isCourierMappeds = await findMappingCourier(orderPackeds.data.order_items[0].shipment_provider, 'LAZADA'); 
                                                                if(isCourierMappeds)
                                                                {
                                                                    isCourierMappeds.forEach(async function(CourierMappeds)
                                                                    {  
                                                                        let data = await pg.query("UPDATE orderheader SET delivery_type_id = $1, waybill_number = $2 WHERE order_header_id = $3",[CourierMappeds.delivery_type_id,orderPackeds.data.order_items[0].tracking_number, value.order_header_id]);
                                                                        updateData = data.rows;
                                                                        if(data.rowCount > 0)
                                                                        {
                                                                            await pg.query('COMMIT')
                                                                            messageSuccess = {
                                                                                status : 200,
                                                                                message : 'OK',
                                                                                detail : {
                                                                                    data : 'SET FULFILLMENT - SUCCESSFULLY SET WAYBILL TO '+orderPackeds.data.order_items[0].tracking_number+' FOR ORDERCODE '+orderCode+' AND SET COURIER TO '+orderPackeds.data.order_items[0].shipment_provider,
                                                                                    waybill : orderPackeds.data.order_items[0].tracking_number,
                                                                                    courier_name : CourierMappeds.name,
                                                                                    courier_service : CourierMappeds.shipping_type
                                                                                }
                                                                            }
                                                                            console.log(messageSuccess);
                                                                        }
                                                                        else{
                                                                            await pg.query('ROLLBACK')
                                                                        }
                                                                    });
                                                                }
                                                                else{
                                                                    messageError = {
                                                                        status : 404,
                                                                        message : 'NOT_FOUND',
                                                                        detail : {
                                                                            data : 'SET FULFILLMENT - ORDERCODE '+orderCode+' FAILED TO UPDATE WAYBILL AND COURIER, BECAUSE '+orderPacked.data.order_items[0].shipment_provider+' NOT FOUND IN MAPPING COURIER'
                                                                        }
                                                                    };
                                                                    console.log(messageError);
                                                                }
                                                            }
                                                            else
                                                            {
                                                                messageError = {
                                                                    status : 400,
                                                                    message : 'BAD_REQUEST',
                                                                    detail : {
                                                                        data : orderPackeds.message
                                                                    }
                                                                };
                                                                console.log(messageError);
                                                            }
                                                        })
                                                        .catch(
                                                            error => console.log(
                                                                JSON.stringify(error, null, 4)
                                                            )
                                                        )
                                                    }
                                                });
                                            }
                                            catch (e) {
                                                await pg.query('ROLLBACK')
                                                throw e
                                            }
                                        }
                                        else{
                                            messageError = {
                                                shop_configuration_id : shopConfigId,
                                                shop_name : shop.shop_name,
                                                success : false,
                                                message : "GET ORDER - THIS SHOP "+shopName+"FAILED TO GET ORDER BECAUSE, "+response.message
                                            };
                                            console.log(messageError);
                                        }
                                    })
                                    .catch(
                                        error => console.log(
                                            JSON.stringify(error, null, 4)
                                        )
                                    )
                                }
                                else{
                                    messageError = {
                                        shop_configuration_id : shopConfigId,
                                        shop_name : shop.shop_name,
                                        success : false,
                                        message : "GET ORDER - THIS SHOP "+shopName+"FAILED TO GET ORDER BECAUSE, "+response.message
                                    };
                                    console.log(messageError);
                                }
                            })
                            .catch(
                                error => console.log(
                                    JSON.stringify(error, null, 4)
                                )
                            )
                        });
                    }
                    else{
                        messageError = {
                            status : 500,
                            message: "FAILED GET ORDER",
                            detail : "SET RESI - Order With code "+orderCode+" Not Found"
                        };
                        console.log(messageError);
                    }
                }
                else
                {
                    messageError = {
                        status : 401,
                        message: "NOT_AUTHORIZED",
                        detail : {
                            data : "SET FULFILLMENT - THIS SHOP "+shopName+" DOESNT HAS PRIVILEGE TO SET FULFILLMENT"
                        }
                    };
                    console.log(messageError);
                }
            });
        }
        else{
            messageError = {
                status : 500,
                message: "FAILED GET CLIENT",
                detail : "SET RESI - FAILED TO GET CLIENT BECAUSE "+shopName+" NOT FOUND IN SHOP CONFIGURATION"
            };
            console.log(messageError);
        }
    }
    else{
        // console.log(validation);
        res.json(validation);
    }
}

async function RequestPickup(req,res,next)
{
    var messageSuccess = {};
    var messageError   = {};
    var validation     = null;
    var orderCode      = req.body.code;
    
    if(!orderCode)
    { 
        validation = {
            "status" : 500,
            "message": 'failed',
            "data"   : 'Order Code Must Be Declare'
        }; 
    }
    else
    {
        if(orderCode == "")
        {
            validation = {
                "status" : 500,
                "message": 'failed',
                "data"   : 'Order Code Cannot Be Empty'
            }; 
        }
    }

    if(!validation)
    {
        let orderDatas = await checkOrderCode(orderCode);
        if(orderDatas)
        {
            orderDatas.forEach(async function(orderData){
                let clients = await findShopConfigById(orderData.shop_configuration_id);
                if(clients)
                {
                    clients.forEach(async function(client){
                        var listOrderItemNo = [];
                        var countryCode = 'INDONESIA';
                        var clientId = client.client_id;
                        var shopConfigId = client.shop_configuration_id;
                        var shopName = client.shop_name;
                        var isConfirmShipment = client.confirm_shipment;
                        var isRequestPickup = client.request_pickup;
                        var appSecret = client.client_code;
                        var accessToken = client.token;
                        var appKey = client.shop_id;

                        if(isConfirmShipment == 1 && isRequestPickup == 1)
                        {
                            var trackingNumber = orderData.waybill_number;
                            
                            if(trackingNumber != '' || trackingNumber != NULL)
                            {
                                const aLazadaAPI = new LazadaAPI(appKey, appSecret, countryCode, accessToken)
                                aLazadaAPI.getShipmentProviders()
                                .then(async (shipmentProviderList) => {
                                    if(shipmentProviderList.code == 0)
                                    {   
                                        aLazadaAPI.getOrderItems({order_id: orderData.code})
                                        .then(async (orderItems)=> 
                                        {
                                            if(orderItems.code == '0')
                                            {
                                                var orderItemIdsTemp = null;
                                                var rawCourier = null;
                                                orderItems.data.forEach(async function(items){
                                                    if (items.warehouse_code == 'dropshipping')
                                                    {
                                                        var len = ", ";
                                                        rawCourier = items.shipment_provider.substr(items.shipment_provider.indexOf(", ") + len.length);
                                                        orderItemIdsTemp = items.order_item_id;
                                                        if (orderItemIdsTemp)
                                                        {
                                                            listOrderItemNo.push(orderItemIdsTemp);
                                                        }
                                                    }
                                                });

                                                var param = {
                                                    shipment_provider: shipmentProviderList.data.shipment_providers[0].name,
                                                    delivery_type    : 'dropship',
                                                    order_item_ids   : JSON.stringify(listOrderItemNo),
                                                    tracking_number  : trackingNumber
                                                }
                                                console.log(param);
                                                aLazadaAPI.setStatusToReadyToShip(param)
                                                .then(async (orderRts)=> 
                                                {
                                                    if (orderRts.code == "0")
                                                    {
                                                        // return response OK
                                                        messageSuccess = {
                                                            status : 200,
                                                            message : 'OK',
                                                            detail : {
                                                                data : 'SET PICKUP - SUCCESSFULLY SET READY TO SHIP FOR ORDERCODE '+orderCode
                                                            }
                                                        };
                                                        console.log(messageSuccess);
                                                    }
                                                    else
                                                    {
                                                        messageError = {
                                                            status : 400,
                                                            message : 'BAD_REQUEST',
                                                            detail : {
                                                                data : orderRts.message
                                                            }
                                                        };
                                                        console.log(messageError);
                                                    }
                                                })
                                                .catch(function (error) {   
                                                    if(error.code == '120')
                                                    {
                                                        var leng = ": ";
                                                        correctCourier = rawCourier.substr(rawCourier.indexOf(": ") + leng.length);
                                                        var param = {
                                                            shipment_provider: correctCourier,
                                                            delivery_type    : 'dropship',
                                                            order_item_ids   : JSON.stringify(listOrderItemNo),
                                                            tracking_number  : trackingNumber
                                                        }
                                                        console.log(param);
                                                        aLazadaAPI.setStatusToReadyToShip(param)
                                                        .then(async (orderRts)=> 
                                                        {
                                                            if (orderRts.code == "0")
                                                            {
                                                                // return response OK
                                                                messageSuccess = {
                                                                    status : 200,
                                                                    message : 'OK',
                                                                    detail : {
                                                                        data : 'SET PICKUP - SUCCESSFULLY SET READY TO SHIP FOR ORDERCODE '+orderCode
                                                                    }
                                                                };
                                                                console.log(messageSuccess);
                                                            }
                                                            else
                                                            {
                                                                messageError = {
                                                                    status : 400,
                                                                    message : 'BAD_REQUEST',
                                                                    detail : {
                                                                        data : orderRts.message
                                                                    }
                                                                };
                                                                console.log(messageError);
                                                            }
                                                        })
                                                        .catch(
                                                            error => console.log(
                                                                JSON.stringify(error, null, 4)
                                                            )
                                                        )
                                                    }
                                                });
                                            }
                                            else{
                                                messageError = {
                                                    status : 400,
                                                    message : 'BAD_REQUEST',
                                                    detail : {
                                                        data : orderItems.message
                                                    }
                                                };
                                                console.log(messageError);
                                            }
                                        })
                                        .catch(
                                            error => console.log(
                                                JSON.stringify(error, null, 4)
                                            )
                                        );                                 
                                    }
                                    else{
                                        messageError = {
                                            status : 400,
                                            message : 'BAD_REQUEST',
                                            detail : {
                                                data : shipmentProviderList.message
                                            }
                                        };
                                        console.log(messageError);
                                    }
                                })
                                .catch(
                                    error => console.log(
                                        JSON.stringify(error, null, 4)
                                    )
                                );
                            }
                            else{
                                messageError = {
                                    status : 400,
                                    message : 'BAD_REQUEST',
                                    detail : {
                                        data : 'SET PICKUP - FAILED SET READY TO SHIP FOR ORDERCODE '+orderCode+' BECAUSE TRACKING NUMBER IS EMPTY'
                                    }
                                };
                                console.log(messageError);
                            }
                        }
                        else{
                            messageError = {
                                status : 401,
                                message : 'NOT_AUTHORIZED',
                                detail : {
                                    data : 'SET PICKUP - THIS SHOP '+shopName+' DOESNT HAS PRIVILEGE TO SET PICKUP'
                                }
                            };
                            console.log(messageError);
                        }
                    });
                }
            });
        }
        else{
            messageError = {
                status : 404,
                message : 'BAD_REQUEST',
                detail : {
                    data : 'SET PICKUP - ORDERCODE '+orderCode+' NOT FOUND, PLEASE CHECK IN EOS'
                }
            };
            console.log(messageError);
        }
    }
    else{
        // console.log(validation);
        res.json(validation);
    }
}

async function generateShippingLabel(req,res,next)
{
    var messageSuccess = {};
    var messageError   = {};
    var validation     = null;
    var orderCode      = req.body.code;
    
    if(!orderCode)
    { 
        validation = {
            "status" : 500,
            "message": 'failed',
            "data"   : 'Order Code Must Be Declare'
        }; 
    }
    else
    {
        if(orderCode == "")
        {
            validation = {
                "status" : 500,
                "message": 'failed',
                "data"   : 'Order Code Cannot Be Empty'
            }; 
        }
    }

    if(!validation)
    {
        let orderDatas = await checkOrderCode(orderCode);
        if(orderDatas)
        {
            orderDatas.forEach(async function(orderData){
                let clients = await findShopConfigById(orderData.shop_configuration_id);
                if(clients)
                {
                    clients.forEach(async function(client){
                        var listOrderItemNo = [];
                        var countryCode = 'INDONESIA';
                        var clientId = client.client_id;
                        var shopConfigId = client.shop_configuration_id;
                        var shopName = client.shop_name;
                        var isConfirmShipment = client.confirm_shipment;
                        var isRequestPickup = client.request_pickup;
                        var appSecret = client.client_code;
                        var accessToken = client.token;
                        var appKey = client.shop_id;

                        if(isConfirmShipment == 1)
                        {
                            const aLazadaAPI = new LazadaAPI(appKey, appSecret, countryCode, accessToken)                            
                            aLazadaAPI.getOrderItems({order_id: orderData.code})
                            .then(async (orderItems)=> 
                            {
                                if(orderItems.code == '0')
                                {
                                    var orderItemIdsTemp = null;
                                    var rawCourier = null;
                                    var orderItemIds = [];
                                    orderItems.data.forEach(async function(items){
                                        if (items.warehouse_code == 'dropshipping')
                                        {
                                            orderItemIdsTemp = items.order_item_id;
                                            if (orderItemIdsTemp)
                                            {
                                                orderItemIds.push(orderItemIdsTemp);
                                            }
                                        }
                                    });

                                    var param = {
                                        doc_type      : 'shippingLabel',
                                        order_item_ids: JSON.stringify(orderItemIds)
                                    }
                                    // console.log(param);
                                    aLazadaAPI.getDocument(param)
                                    .then(async (documentResponse)=> 
                                    {
                                        if (documentResponse.code == "0")
                                        {
                                            // console.log(documentResponse.data.document.file);
                                            if (documentResponse.data.document.file)
                                            {
                                                // const plain = Buffer.from(documentResponse.data.document.file).toString('base64');
                                                const plain = Buffer.from(documentResponse.data.document.file, 'base64').toString('utf8');
                                                // fs.writeFileSync('stack-abuse-logo-out.png', plain);
                                                console.log(plain);
                                            }
                                        }
                                        else
                                        {
                                            messageError = {
                                                status : 400,
                                                message : 'BAD_REQUEST',
                                                detail : {
                                                    data : orderRts.message
                                                }
                                            };
                                            console.log(messageError);
                                        }
                                    })
                                    .catch(
                                        error => console.log(
                                            JSON.stringify(error, null, 4)
                                        )
                                    );
                                }
                                else{
                                    messageError = {
                                        status : 400,
                                        message : 'BAD_REQUEST',
                                        detail : {
                                            data : orderItems.message
                                        }
                                    };
                                    console.log(messageError);
                                }
                            })
                            .catch(
                                error => console.log(
                                    JSON.stringify(error, null, 4)
                                )
                            ); 
                        }
                        else{
                            messageError = {
                                status : 401,
                                message : 'NOT_AUTHORIZED',
                                detail : {
                                    data : 'SET PICKUP - THIS SHOP '+shopName+' DOESNT HAS PRIVILEGE TO SET PICKUP'
                                }
                            };
                            console.log(messageError);
                        }
                    });
                }
            });
        }
        else{
            messageError = {
                status : 404,
                message : 'BAD_REQUEST',
                detail : {
                    data : 'SET PICKUP - ORDERCODE '+orderCode+' NOT FOUND, PLEASE CHECK IN EOS'
                }
            };
            console.log(messageError);
        }
    }
    else{
        // console.log(validation);
        res.json(validation);
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
        var variantId      = req.body.variant_id;
        var quantity       = req.body.quantity;
        
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
        
        if(!variantId)
        { 
            validation = {
                "status" : 500,
                "message": 'failed',
                "data"   : 'Adjustment Type Must Be Declare'
            }; 
        }
        else
        {
            if(variantId == "")
            {
                validation = {
                    "status" : 500,
                    "message": 'failed',
                    "data"   : 'Adjustment Type Cannot Be Empty'
                }; 
            }
        }
        
        if(!quantity)
        { 
            validation = {
                "status" : 500,
                "message": 'failed',
                "data"   : 'Location Code Must Be Declare'
            }; 
        }
        else
        {
            if(quantity == "")
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
            const shopconfigs = await conn_pg.query("SELECT shop.shop_id, cl.client_id, shop.shop_configuration_id, shop.client_code, shop.token, shop.shop_name FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id = shop.client_id LEFT JOIN channel ch ON shop.channel_id = ch.channel_id WHERE ch.name = 'LAZADA' and shop.update_stock = 1 AND cl.api_key = $1",[apiKey]);
            if(shopconfigs.rowCount > 0){
                var configs = shopconfigs.rows;
                configs.forEach(async function(rest)
                {
                    var countryCode = 'INDONESIA';
                    var appKey = rest.shop_id;
                    var clientId = rest.client_id;
                    var shopConfigId = rest.shop_configuration_id;
                    var appSecret = rest.client_code;
                    var accessToken = rest.token;
                    var shopName = rest.shop_name;
                    let values = await checkMappingVariant(variantId, shopConfigId);
                    if(values){
                        values.forEach(async function(product)
                        {
                            const lazadaItemId = product.product_id;
                            const lazadaSkuId = product.product_code;
                            const lazadaSellerSku = product.variant_id;
                            var payloadUpdateStock = "<Request><Product><Skus><Sku><ItemId>"+lazadaItemId+"</ItemId><SkuId>"+lazadaSkuId+"</SkuId><SellerSku>"+lazadaSellerSku+"</SellerSku><Quantity>"+quantity+"</Quantity></Sku></Skus></Product></Request>";

                            const aLazadaAPI = new LazadaAPI(appKey, appSecret, countryCode, accessToken)                            
                            aLazadaAPI.updatePriceQuantity({payload: payloadUpdateStock})
                            .then(async (stock)=> 
                            {
                                if(stock.code == '0')
                                {
                                    messageSuccess = {
                                        apikey : apiKey,
                                        shop_configuration_id : shopConfigId,
                                        variant_id : variantId,
                                        sku : product.product_code,
                                        quantity : quantity,
                                        shop_name : shopName,
                                        success : true,
                                        message : "SYNC STOCK - SUCCESSFULLY SYNC STOCK FOR THIS PRODUCT VARIANT_ID : "+variantId+", SKU : "+product.product_code+" TO "+quantity
                                    };
                                    // console.log(messageSuccess);
                                    res.json(messageSuccess);
                                }
                                else{
                                    messageError = {
                                        apikey : apiKey,
                                        shop_configuration_id : shopConfigId,
                                        variant_id : variantId,
                                        sku : product.product_code,
                                        quantity : quantity,
                                        shop_name : shopName,
                                        success : false,
                                        message : "SYNC STOCK - FAILED TO SYNC STOCK FOR THIS PRODUCT VARIANT_ID : "+variantId+", SKU : "+product.product_code+" BECAUSE API ERROR "+stock.message
                                    };
                                    // console.log(messageError);
                                    res.json(messageError);
                                }
                            })
                            .catch(
                                error => console.log(
                                    JSON.stringify(error, null, 4)
                                )
                            );
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
    // return orderCode;
    let pg = await conn_pg.connect();
    try {    
        await pg.query('BEGIN')
        var statusId = 70;
        var createdName = "Automatic By System API";
        orderCode = orderCode.toString();
        let orderheaders = await pg.query("INSERT INTO orderheader(order_code, location_id, client_id, shop_configuration_id, status_id, delivery_type_id, payment_type_id, channel_id, stock_type_id, order_type_id, ref_order_id, code, order_date, booking_number, waybill_number, recipient_name, recipient_phone, recipient_email, recipient_address, recipient_district, recipient_city, recipient_province, recipient_country, recipient_postal_code, latitude, longitude, total_koli, shipping_price, total_price, cod_price, dfod_price, stock_source, remark, created_date, modified_date, created_by, modified_by, created_name, store_name, discount, total_product_price) VALUES +1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, 0, 0, 0, $25, $26, $27, 0, $28, $29, NOW(), NOW(), 0, 0, $30, $31, $32, $33) RETURNING order_header_id, status_id",[orderCode, locationId, clientId, shopConfigurationId, statusId, deliveryTypeId, paymentId, channelId, stockTypeId, orderTypeId, refOrderId, orderCode, timeStamp, bookingNumber, waybillNumber, recipientName, recipientPhone, recipientEmail, recipientAddress, recipientDistrict, recipientCity, recipientProvince, recipientCountry, recipientPostalCode, shippingPrice, totalPrice, codPrice, stockSource, remarks, createdName, shopName, discount, totalProductPrice]);
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
                        let tmpretrys = await pg.query("INSERT INTO tmpretry(channel_id, shop_configuration_id, order_header_id, order_code, acked, counter_ack, created_date, modified_date, created_by, modified_by) VALUES($1, $2, $3, $4, 0, 0, NOW(), NOW(), 0, 0)",[channelId,shopConfigurationId,orderHeader.order_header_id,orderCode]);
                        if(tmpretrys.rowCount > 0)
                        { 
                            items.forEach(async function(item){
                                var variant    = item.sku;
                                var codeReplace = variant.replace('/\t+/', '');
                                var codeTrim = codeReplace.trim();
                                var variants = codeTrim.toUpperCase();
                                let isInMappings = await checkMappingVariant(variants,shopConfigurationId);  
                                // console.log(isInMappings);
                                if(isInMappings)   
                                {  
                                    isInMappings.forEach(async function(isInMapping)
                                    {  
                                        if(isInMapping.item_id != null)
                                        {
                                            // var sku         = item.product.id;
                                            var unitWeight     = 0;
                                            var unitPrice      = parseInt(item.item_price);
                                            var totalUnitPrice = parseInt(item.item_price);
                                            var orderQuantity  = 1;
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
                                            // console.log(messageError);
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
                                    // console.log(messageError);
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

//cek data
async function checkShopLocation(shopConfigId)
{
    let sql = await conn_pg.query("SELECT s.client_id, sl.location_channel, l.name, l.code, l.location_id FROM shoplocation sl LEFT JOIN location l ON sl.location_id = l.location_id LEFT JOIN shopconfiguration s ON sl.shop_configuration_id = s.shop_configuration_id WHERE sl.shop_configuration_id = $1",[shopConfigId]);
    var results = sql.rows;
    if(sql.rowCount > 0)
    {
        return results;
    }
}

async function checkOrderCode(orderCode)
{
    // var resIsInOrders = "";
    let res_isInOrder = await conn_pg.query("SELECT order_header_id, ref_order_id, shop_configuration_id, code, order_code, waybill_number FROM orderheader WHERE code = $1",[orderCode]);
    var resIsInOrders = res_isInOrder.rows;
    // console.log(res_isInOrder.rows)
    if(res_isInOrder.rowCount > 0)
    {
        return resIsInOrders;
    }
}

async function findShopConfigById(shopConfigId)
{
    let sql = await conn_pg.query("SELECT shop.shop_id, cl.client_id, shop.shop_configuration_id, cl.api_key, shop.shop_name, shop.get_resi, shop.client_code, shop.token, shop.accept_order, shop.confirm_shipment, shop.request_pickup FROM client cl LEFT JOIN shopconfiguration shop ON cl.client_id = shop.client_id LEFT JOIN channel ch ON shop.channel_id = ch.channel_id WHERE shop.shop_configuration_id = $1 AND cl.is_stockless = 1 AND shop.active = 1",[shopConfigId]);
    var results = sql.rows;
    if(sql.rowCount > 0)
    {
        return results;
    }
}

async function checkMappingVariant(variantId, shopConfigId)
{
    let result_mapping = await conn_pg.query("SELECT item_id, product_id, product_code, product_name, variant_id FROM mappingitem WHERE variant_id = $1 AND shop_configuration_id = $2", [variantId,shopConfigId]);
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

async function findCourier(courier, deliveryType)
{
    // console.log(channelName);
    let selectCourier = await conn_pg.query("SELECT dt.delivery_type_id FROM deliverytype dt LEFT JOIN courier c ON dt.courier_id = c.courier_id WHERE c.name = $1 AND dt.name = $2", [courier,deliveryType]);
    var Courier = selectCourier.rows;
    if(selectCourier.rowCount > 0)
    {
        return Courier;
    }
}

async function findMappingCourier(courier, channelName)
{
    let selectCourier = await conn_pg.query("SELECT dt.delivery_type_id, mc.courier_name as shipping_method, dt.name as shipping_type, c.name, ch.name as channel_name FROM mappingcourier mc LEFT JOIN deliverytype dt ON mc.delivery_type_id = dt.delivery_type_id LEFT JOIN courier c ON dt.courier_id = c.courier_id LEFT JOIN channel ch ON mc.channel_id = ch.channel_id WHERE mc.courier_name = $1 AND ch.name = $2", [courier, channelName]);
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
async function insertIntoMappingItem(item_id, shop_config_id, item_product_id, item_product_code, item_product_name, item_product_url, item_variant_id)
{
    let data = await conn_pg.query("INSERT INTO mappingitem (item_id, shop_configuration_id, product_id, product_code, product_name, product_url, variant_id, active, created_date, modified_date, created_by, modified_by) values ($1, $2, $3, $4, $5, $6, $7, 1, NOW(), NOW(), 0, 0)",[item_id,shop_config_id,item_product_id,item_product_code,item_product_name,item_product_url,item_variant_id]);
    insertData = data.rows;
    if(data.rowCount > 0)
    {
        return insertData;
    }
}

async function insertIntoMappingItemWithNullItemId(shop_config_id, item_product_id, item_product_code, item_product_name, item_product_url, item_variant_id)
{
    let data = await conn_pg.query("INSERT INTO mappingitem (shop_configuration_id, product_id, product_code, product_name, product_url, variant_id, active, created_date, modified_date, created_by, modified_by) values ($1, $2, $3, $4, $5, $6, 1, NOW(), NOW(), 0, 0)",[shop_config_id, item_product_id, item_product_code, item_product_name, item_product_url, item_variant_id]);
    insertData = data.rows;
    if(data.rowCount > 0)
    {
        return insertData;
    }
}

async function updateMappingItemByVariantAndShop(itemId, productCode, mappingItem)
{
    let data = await conn_pg.query("UPDATE mappingitem SET item_id = $1, product_code = $2 WHERE mapping_item = $3",[itemId, productCode, mappingItem]);
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
    acceptOrder,
    RequestPickup,
    generateShippingLabel,
    updateStock
}