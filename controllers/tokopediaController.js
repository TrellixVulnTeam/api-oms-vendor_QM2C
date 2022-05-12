const jwt        = require('jsonwebtoken');
const conn       = require('../dbConnection').promise();
const axios      = require('axios');
const db_dev     = require('../dbConnection').db_dev;
const { param }  = require('express/lib/request');
const logger     = require('../logs');
const cron       = require('node-cron');
const nodeBase64 = require('nodejs-base64-converter');
const conn_pg    = require('../dbConnection_pg');

async function generateToken (req,res,next) 
{
  try 
  {
    const config = await conn_pg.query("select shp.shop_configuration_id,shp.shop_id,shp.shop_name,shp.fs_id,shp.client_code,shp.client_secret from shopconfiguration shp join channel ch on shp.channel_id = ch.channel_id where ch.name='TOKOPEDIA' and shp.active='1'");
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
          const token = nodeBase64.encode(configs.client_code+":"+configs.client_secret);
          var axios = require('axios');
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
              await conn_pg.query("UPDATE shopconfiguration SET token =($1) WHERE shop_configuration_id=($2)",[response.data.access_token,configs.shop_configuration_id]).then(
                  (data)=>{
                      res.json({
                          status : 200,
                          message: "success",
                          data   : response.data
                      });
                  }
              ).catch((err)=>{
                  res.json({
                      status : 200,
                      message: "failed",
                      data   : err
                  });
              })
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
              res.json({
                  status : false,
                  message: "failed",
                  data   : "Server error"
              });
          });
      });
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

async function test()
{
  console.log("OK");
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
          var axios = require('axios');
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
        var axios = require('axios');
        var config = {
          method: 'get',
          url: 'https://fs.tokopedia.net/v2/products/fs/'+configs.fs_id+'/1/1000',
          headers: { 
            'Authorization': 'Bearer '+configs.token,
          }
        };
        axios(config)
        .then(async (response)=> {
          response.data.data.forEach(items => {
            saveProduct(configs,items);
          });
        })
        .catch(function (error) {
          console.log(error);
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

async function saveProduct(configs,items)
{
  let data = await conn_pg.query("INSERT INTO mappingitem( shop_configuration_id, product_id, product_code, product_name, variant_id, active, created_by, modified_by, created_date) VALUES ($1,$2,$3,$4,$5,1,0,0,NOW())",[configs.shop_configuration_id,items.product_id,items.sku,items.name,items.product_id]);
  if(data.rowCount == 0)
  {
    console.log("Success");
  }
}
module.exports ={
    generateToken,
    test,
    getOrder,
    shopInfo,
    getProduct
}