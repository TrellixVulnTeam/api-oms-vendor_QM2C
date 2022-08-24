const jwt        = require('jsonwebtoken');
const conn       = require('../dbConnection').promise();
const axios      = require('axios');
const { param }  = require('express/lib/request');
const logger     = require('../logs');
const cron       = require('node-cron');
const nodeBase64 = require('nodejs-base64-converter');
const conn_pg    = require('../dbConnection_pg');

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
                    var date = new Date();
                    date.getDate(date.setDate(date.getDate() + response.data.expires_in));
                    console.log(date)
                    var dates = new Date(date);
                    let month = await setMonth(dates.getMonth());
                    var expiresIn = dates.getFullYear()+"-"+month+"-"+dates.getDate()+" "+dates.getHours()+":"+dates.getMinutes()+":"+dates.getSeconds();
                    console.log(expiresIn)
                    // let update = await conn_pg.query("UPDATE shopconfiguration SET token = $1, expires_in = $2, generate_in = NOW(), modified_date = NOW() WHERE shop_configuration_id = $3", [response.data.access_token,expiresIn,configs.shop_configuration_id]);
                    // if(update.rowCount > 0)
                    // {
                    //     res.json({
                    //         status : 200,
                    //         message: "OK",
                    //         data   : "TOKOPEDIA AUTH - SUCCESSFULLY GENERATE TOKEN FOR THIS SHOP "+configs.shop_name
                    //     });
                    // }
                    // else
                    // {
                    //     res.json({
                    //         status : 500,
                    //         message: "FAILED",
                    //         data   : "TOKOPEDIA AUTH - FAILED TO GET TOKEN FOR THIS SHOP "+configs.shop_name
                    //     });
                    // }
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

async function test()
{
    var date = new Date();
    date.getDate() + 172178;
    console.log(date)
    // var dates = new Date(date);
    // let month = await setMonth(dates.getMonth());
    // var expiresIn = dates.getFullYear()+"-"+month+"-"+dates.getDate()+" "+dates.getHours()+":"+dates.getMinutes()+":"+dates.getSeconds();
    // console.log(expiresIn)
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
    try 
    {
        const config = await conn_pg.query("select shp.shop_configuration_id,shp.shop_id,shp.shop_name,shp.fs_id,shp.client_code,shp.client_secret from shopconfiguration shp join channel ch on shp.channel_id = ch.channel_id where ch.name='TOKOPEDIA' and shp.active='1' and shp.get_order='1'");
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
                res.json({
                    status: true,
                    message: "success",
                    data  : configs
                });
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

async function getProduct(req,res,next)
{
    try 
    {
        const config = await conn_pg.query("select shp.token,shp.shop_configuration_id,shp.shop_id,shp.shop_name,shp.fs_id,shp.client_code,shp.client_secret from shopconfiguration shp join channel ch on shp.channel_id = ch.channel_id where ch.name='TOKOPEDIA' and shp.active='1' and shp.sync_product='1'");
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
                var i = 1; 
                for(var i = 1; i < 200 ; i++)
                {
                    var config = {
                        method: 'GET',
                        url   : 'https://fs.tokopedia.net/inventory/v1/fs/'+getShop.fs_id+'/product/info?shop_id='+getShop.shop_id+'&page=".$i."&per_page=50&sort=7',
                        headers: { 
                            'Content-type' : 'application/json',
                            'Content-Length': '0',
                            'Authorization': 'Bearer '+getShop.token
                        },
                        validateStatus: () => true
                    };
                    axios(config)
                    .then(async (response)=> {
                        var datas = response.data;
                        if(datas.meta.http_status == 200)
                        {
                            datas.data.forEach(async function(value)
                            {
                                console.log(value)
                                // if(value.variants)
                                // {
                                //     value.variants.forEach(async function(variants){
                                //         var name      = value.name+" - "+variants.variant_name;
                                //         var url       = value.url;
                                //         var sku       = variants.sku_name;
                                //         var productId = variants.product_id;
                                //         var skuId     = variants.id;
                                        
                                //         let result_mapping = await conn_pg.query("SELECT product_code,product_name FROM mappingitem WHERE variant_id = $1 AND shop_configuration_id = $2", [sku,rest.shop_configuration_id]);
                                //         var checkMappingItems = result_mapping.rows;
                                //         if(result_mapping.rowCount == 0)
                                //         {
                                //             // console.log("kosong");
                                //             let checkItem = await conn_pg.query("SELECT item_id FROM item WHERE code = $1 AND client_id = $2", [sku,rest.client_id]);
                                //             var chekItems = checkItem.rows;
                                //             if (checkItem.rowCount > 0) 
                                //             {
                                //                 chekItems.forEach(function(chekItem)
                                //                 {  
                                //                     var insert = insertIntoMappingItem(chekItem.item_id,rest.shop_configuration_id,skuId,productId,name,url,sku);
                                //                     if(insert)
                                //                     {
                                //                         messageSuccess = {
                                //                             status : 200,
                                //                             message : "Success Mapping Item",
                                //                             detail : {
                                //                                 data : "MAPPING ITEM - "+sku+" has mapped successfully"
                                //                             }
                                //                         };
                                //                         // console.log(messageSuccess);
                                //                         // res.json({messageNullItemId});
                                //                         res.json(messageSuccess);
                                //                     }
                                //                 });
                                //             }
                                //             else{
                                //                 var insert = insertIntoMappingItemWithNullItemId(rest.shop_configuration_id,skuId,productId,name,url,sku);
                                //                 if(insert)
                                //                 {
                                //                     messageSuccess = {
                                //                         status : 200,
                                //                         message : "Mapping With Null Item Id",
                                //                         detail : {
                                //                             data : "MAPPING ITEM - Mapping With Null Item Id For "+sku+" cause by No Reference Found in MASTER ITEM"
                                //                         }
                                //                     };
                                //                     // console.log(messageSuccess);
                                //                     // res.json({messageNullItemId});
                                //                     res.json(messageSuccess);
                                //                 }
                                //             }
                                //         }
                                //         else{
                                //             console.log(checkMappingItems);
                                //             checkMappingItems.data.forEach(async function(checkMappingItem)
                                //             {
                                //                 if(checkMappingItem.product_code != productId || checkMappingItem.product_name != name)
                                //                 {
                                //                     let checkItem = await conn_pg.query("SELECT item_id FROM item WHERE code = $1 AND client_id = $2", [sku,rest.client_id]);
                                //                     var chekItems = checkItem.rows;
                                //                     if (checkItem.rowCount > 0) 
                                //                     {
                                //                         chekItems.forEach(function(chekItem)
                                //                         {  
                                //                             var update = updateMappingItemByVariantAndShop(chekItem.item_id,productId,sku,rest.shop_configuration_id);
                                //                             if(update)
                                //                             {
                                //                                 messageSuccess = {
                                //                                     status : 200,
                                //                                     message : "Success Update Mapping",
                                //                                     detail : {
                                //                                         data : "MAPPING ITEM - "+sku+" has been updated succesfully"
                                //                                     }
                                //                                 };
                                //                                 // console.log(messageSuccess);
                                //                                 // res.json({messageUpdate});
                                //                                 res.json(messageSuccess);
                                //                             }
                                //                         });
                                //                     }
                                //                     else 
                                //                     {
                                //                         messageError = {
                                //                             status : 500,
                                //                             message : "Failed",
                                //                             detail : {
                                //                                 data : "Failed while update mapping item because Item Code "+sku+" is not exist in Haistar System. Please regist this item first or update sku on old item."
                                //                             }
                                //                         };
                                //                         // console.log(messageError);
                                //                         // res.json({messageFailedUpdate});
                                //                         res.json(messageError);
                                //                     }
                                //                 }
                                //                 else
                                //                 {
                                //                     messageError = {
                                //                         status : 500,
                                //                         message : "Item Already Exist",
                                //                         detail : {
                                //                             data : "MAPPING ITEM - Itemcode "+sku+" has exist in MAPPING ITEM but item id is null"
                                //                         }
                                //                     };
                                //                     // console.log(messageError);
                                //                     // res.json({messageAlreadyExist});
                                //                     res.json(messageError);
                                //                 }
                                //             });
                                //         }
                                //     });
                                // }
                                // else
                                // {
                                //     // console.log("single");
                                //     var sku       = value.sku_name;
                                //     var productId = value.id;
                                //     var skuId     = value.sku_id;
                                //     var name      = value.name;
                                //     var url       = value.url;
                                    
                                //     let result_mapping = await conn_pg.query("SELECT product_code,product_name FROM mappingitem WHERE product_code = $1 AND shop_configuration_id = $2", [productId,rest.shop_configuration_id]);
                                //     var checkMappingItems = result_mapping.rows;
                                //     if(result_mapping.rowCount == 0)
                                //     {
                                //         let checkItem = await conn_pg.query("SELECT item_id FROM item WHERE code = $1 AND client_id = $2", [sku,rest.client_id]);
                                //         var chekItems = checkItem.rows;
                                //         if (checkItem.rowCount > 0) 
                                //         {
                                //             chekItems.forEach(function(chekItem)
                                //             {  
                                //                 var insert = insertIntoMappingItem(chekItem.item_id,rest.shop_configuration_id,skuId,productId,name,url,sku);
                                //                 if(insert)
                                //                 {
                                //                     messageSuccess = {
                                //                         status : 200,
                                //                         message : "Success Mapping Item",
                                //                         detail : {
                                //                             data : "MAPPING ITEM - "+sku+" has mapped successfully"
                                //                         }
                                //                     };
                                //                     // console.log(messageSuccess);
                                //                     // res.json({messageNullItemId});
                                //                     res.json(messageSuccess);
                                //                 }
                                //             });
                                //         }
                                //         else{
                                //             var insert = insertIntoMappingItemWithNullItemId(rest.shop_configuration_id,skuId,productId,name,url,sku);
                                //             if(insert)
                                //             {
                                //                 messageSuccess = {
                                //                     status : 200,
                                //                     message : "Mapping With Null Item Id",
                                //                     detail : {
                                //                         data : "MAPPING ITEM - Mapping With Null Item Id For "+sku+" cause by No Reference Found in MASTER ITEM"
                                //                     }
                                //                 };
                                //                 // console.log(messageSuccess);
                                //                 // res.json({messageNullItemId});
                                //                 res.json(messageSuccess);
                                //             }
                                //         }
                                //     }
                                //     else{
                                //         checkMappingItems.data.forEach(async function(checkMappingItem)
                                //         {
                                //             if(checkMappingItem.product_code != productId || checkMappingItem.product_name != name)
                                //             {
                                //                 let checkItem = await conn_pg.query("SELECT item_id FROM item WHERE code = $1 AND client_id = $2", [sku,rest.client_id]);
                                //                 var chekItems = checkItem.rows;
                                //                 if (checkItem.rowCount > 0) 
                                //                 {
                                //                     chekItems.forEach(function(chekItem)
                                //                     {  
                                //                         var update = updateMappingItemByVariantAndShop(chekItem.item_id,productId,sku,rest.shop_configuration_id);
                                //                         if(update)
                                //                         {
                                //                             var messageUpdate = {
                                //                                 status : 200,
                                //                                 message : "Success Update Mapping",
                                //                                 detail : {
                                //                                     data : "MAPPING ITEM - "+sku+" has been updated succesfully"
                                //                                 }
                                //                             };
                                //                             // console.log(messageUpdate);
                                //                             // res.json({messageUpdate});
                                //                             res.json(messageUpdate);
                                //                         }
                                //                     });
                                //                 }
                                //                 else 
                                //                 {
                                //                     var messageError = {
                                //                         status : 500,
                                //                         message : "Failed",
                                //                         detail : {
                                //                             data : "Failed while update mapping item because Item Code "+sku+" is not exist in Haistar System. Please regist this item first or update sku on old item."
                                //                         }
                                //                     };
                                //                     // console.log(messageError);
                                //                     // res.json({messageFailedUpdate});
                                //                     res.json(messageError);
                                //                 }
                                //             }
                                //             else
                                //             {
                                //                 var messageError = {
                                //                     status : 500,
                                //                     message : "Item Already Exist",
                                //                     detail : {
                                //                         data : "MAPPING ITEM - Itemcode "+sku+" has exist in MAPPING ITEM but item id is null"
                                //                     }
                                //                 };
                                //                 // console.log(messageError);
                                //                 // res.json({messageAlreadyExist});
                                //                 res.json(messageError);
                                //             }
                                //         });
                                //     }
                                // }
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
    generateToken,
    test,
    getOrder,
    shopInfo,
    getProduct
}