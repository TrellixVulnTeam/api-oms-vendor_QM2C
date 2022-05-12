const jwt      = require('jsonwebtoken');
const conn     = require('../dbConnection').promise();
const crypto   = require('crypto');
const db_dev   = require('../dbConnection');
const CryptoJS = require("crypto-js");
const { enc }  = require('crypto-js/core');

exports.serviceRates = async (req,res,next) => {
    const path  = 'http://doit-sit.anteraja.id/titipaja/serviceRates|';
    var   axios = require('axios');
    var   data  = JSON.stringify({"weight": 2000,"origin": "35.15.01","destination": "35.15.01"});
    var   encr  = CryptoJS.HmacSHA256(path+data, "SYRzSiaro+a9U0wa5munOw==").toString();
    var config = {
        method: 'post',
        url: path,
        headers: { 
            'auth-id'     : 'Anteraja_x_Titipaja_SIT',
            'auth-hash'   : encr,
            'Content-Type': 'application/json'
        },
        data : data
    };

    axios(config)
    .then(function (response) {
       
            return res.json({
                status : 200,
                message: 'Success',
                data   : response.data.content
            });
    })
    .catch(function (error) {
        return res.json({
            status : 500,
            message: 'Failed',
            data   : error
        });
    });
}

exports.generateWaybill = async (req,res,next) => {
    const path  = 'http://doit-sit.anteraja.id/titipaja/order|';
    var   axios = require('axios');
    var   data  = JSON.stringify({
        "booking_id":"PREFIX-2019100818150102",
        "invoice_no":"INV/RJ/2019090403",
        "service_code":"REG",
        "parcel_total_weight":3000,
        "shipper":{
            "name":"JuliShop",
            "phone":"081234324283",
            "email":"julishop@gmail.com",
            "district":"35.15.01",
            "address":"Jl Kampung Pulo Pinang Ranti",
            "postcode":"13510",
            "geoloc":""
        },
        "receiver":{
            "name":"JuliBuyer",
            "phone":"012931232139819",
            "email":"julibuyer@gmail.com",
            "district":"35.15.01",
            "address":"Jalan Halim Perdanakusuma, RT.3/RW.4, Halim Perdana Kusumah",
            "postcode":"13610",
            "geoloc":""
        },
        "items":[
            {
                "item_name":"Laptop 2",
                "item_desc":"Laptop ROG",
                "item_category":"Elektronik",
                "item_quantity":2,
                "declared_value":15000000,
                "weight":2000
            },
            {
                "item_name":"SSD 256GB",
                "item_desc":"SSD Samsung 256GB",
                "item_category":"Elektronik",
                "item_quantity":1,
                "declared_value":1200000,
                "weight":1000
            }
        ],
        "use_insurance":true,
        "declared_value":16200000,
        "expect_time":"2019-09-04 17:45:00"
    });
    var   encr  = CryptoJS.HmacSHA256(path+data, "SYRzSiaro+a9U0wa5munOw==").toString();
    var config = {
        method: 'post',
        url: 'http://doit-sit.anteraja.id/titipaja/order',
        headers: { 
            'auth-id'     : 'Anteraja_x_Titipaja_SIT',
            'auth-hash'   : encr,
            'Content-Type': 'application/json'
        },
        data : data
    };

    axios(config)
    .then(function (response) {
       
            return res.json({
                status : 200,
                message: 'Success',
                data   : response.data.content
            });
    })
    .catch(function (error) {
        return res.json({
            status : 500,
            message: 'Failed',
            data   : error
        });
    });
}

exports.requestPickup = async (req,res,next) => {

    // catatan
    // jika sameday < 15:00 kirim H+1
    // jika sameday jam 00:01 s/d 07:59 dikirim dari jam 08:00-10:00
    // jika regular & nextday H+1 jam 10:00-12:00

    const path  = 'http://doit-sit.anteraja.id/titipaja/requestPickup|';
    var   axios = require('axios');
    var   data  = JSON.stringify({
        "waybill_no" : "10000010931150",
        "expect_time": "2019-10-09 13:39:00"
    });
    var   encr  = CryptoJS.HmacSHA256(path+data, "SYRzSiaro+a9U0wa5munOw==").toString();
    var config = {
        method: 'post',
        url: 'http://doit-sit.anteraja.id/titipaja/requestPickup',
        headers: { 
            'auth-id'     : 'Anteraja_x_Titipaja_SIT',
            'auth-hash'   : encr,
            'Content-Type': 'application/json'
        },
        data : data
    };

    axios(config)
    .then(function (response) {
       
            return res.json({
                status : 200,
                message: 'Success',
                data   : response.data.content
            });
    })
    .catch(function (error) {
        return res.json({
            status : 500,
            message: 'Failed',
            data   : error
        });
    });
}

exports.requestCancel = async (req, res, next) =>{
    const path  = 'http://doit-sit.anteraja.id/titipaja/cancelOrder|';
    var   axios = require('axios');
    var   data  = JSON.stringify({
        "waybill_no":req.body.waybill_no
    });
    var   encr  = CryptoJS.HmacSHA256(path+data, "SYRzSiaro+a9U0wa5munOw==").toString();
    var config = {
        method: 'post',
        url: 'http://doit-sit.anteraja.id/titipaja/cancelOrder',
        headers: { 
            'auth-id'     : 'Anteraja_x_Titipaja_SIT',
            'auth-hash'   : encr,
            'Content-Type': 'application/json'
        },
        data : data
    };

    axios(config)
    .then(function (response) {
        if(response.data.status == 200)
        {
            return res.json({
                status : 200,
                message: 'Success',
                data   : "success cancel waybill "+req.body.waybill_no
            });
        }
        else
        {
            return res.json({
                status:500,
                message:'Failed',
                data:(response.data.error)
            });
        }
            
    })
    .catch(function (error) {
        return res.json({
            status : 500,
            message: 'Failed',
            data   : error
        });
    });
}

exports.tracking = async (req,res,next) => {
    const path  = 'http://doit-sit.anteraja.id/titipaja/tracking|';
    var   axios = require('axios');
    var   data  = JSON.stringify({
        "waybill_no":req.body.waybill_no
    });
    var   encr  = CryptoJS.HmacSHA256(path+data, "SYRzSiaro+a9U0wa5munOw==").toString();
    var config = {
        method: 'post',
        url: 'http://doit-sit.anteraja.id/titipaja/tracking',
        headers: { 
            'auth-id'     : 'Anteraja_x_Titipaja_SIT',
            'auth-hash'   : encr,
            'Content-Type': 'application/json'
        },
        data : data
    };

    axios(config)
    .then(function (response) {
        if(response.data.status == 200)
        {
            return res.json({
                status : 200,
                message: 'Success',
                data   : response.data.content
            });
        }
        else
        {
            return res.json({
                status:500,
                message:'Failed',
                data:(response.data.error)
            });
        }
            
    })
    .catch(function (error) {
        return res.json({
            status : 500,
            message: 'Failed',
            data   : error
        });
    });
}