const jwt          = require('jsonwebtoken');
const conn         = require('../dbConnection').promise();
const crypto       = require('crypto');
const axios        = require('axios');
const db_dev       = require('../dbConnection');
const { param }    = require('express/lib/request');
const logger       = require('../logs');
const { orderWebhook } = require('./webhookController');

exports.giftCard = async(req,res,next) => {
    const [rows] = await conn.execute("select doh.orderNo, doh.soReference1,dohu.dain02, doh.releaseStatus from doc_order_header doh join doc_order_header_udf dohu on doh.orderNo = dohu.orderNo where doh.billingAddress3=?",[req.body.url]);
    
    if(rows.length <= 0)
    {
        return res.json({
            status : 404,
            message: 'failed',
            count  : rows.length,
            data   : rows
        });
    }
    else
    {
        const [update] = await conn.execute('UPDATE doc_order_header doh join doc_order_header_udf dohu on doh.orderNo = dohu.orderNo set dohu.dain02=2 , doh.releaseStatus="Y", dohu.dadd02=NOW() where doh.orderNo=?',[rows[0].orderNo]);
        if (update.affectedRows === 2) {
            return res.json({
                status : 200,
                message: 'success',
                count  : rows.length,
                data   : rows
            });
        }
        else
        {
            return res.json({
                status : 500,
                message: 'Failed Update',
                count  : update.length,
                data   : update
            });
        }
    }
}
