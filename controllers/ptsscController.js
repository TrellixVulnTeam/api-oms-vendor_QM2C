const db_dev = require('../dbConnection').promise();
const logger = require('../logs');
const axios = require('axios');

exports.acknowledgeOrder = async (req, res, next) => {
    logger.info(req.path);

    try {
        //const customerId = req.body.jwt.customerId;

        return res.json({
            status: 200,
            message: 'success',
            data: []
        });

    }
    catch (err) {
        logger.error(err.message + " " + JSON.stringify(err));

        return res.status(500).json({
            status: 500,
            message: "failed",
            data: err.message
        });
    }
}

exports.notAcknowledgeOrder = async (req, res, next) => {
    logger.info(req.path);

    try {
        //const customerId = req.body.jwt.customerId;

        return res.json({
            status: 200,
            message: 'success',
            data: []
        });
    }
    catch (err) {
        logger.error(err.message + " " + JSON.stringify(err));

        return res.status(500).json({
            status: 500,
            message: "failed",
            data: err.message
        });
    }
}



exports.shippedOrder = async (req, res, next) => {
    logger.info(req.path);
    logger.info(JSON.stringify(req.body));

    try {
        //const customerId = req.body.jwt.customerId;

        return res.json({
            status: 200,
            message: 'success',
            data: []
        });
    }
    catch (err) {
        logger.error(err.message + " " + JSON.stringify(err));

        return res.status(500).json({
            status: 500,
            message: "failed",
            data: err.message
        });
    }
}

exports.stockAdjustment = async (req, res, next) => {
    logger.info(req.path);
    logger.info(JSON.stringify(req.body));

    try {
        //const customerId = req.body.jwt.customerId;

        return res.json({
            status: 200,
            message: 'success',
            data: []
        });
    }
    catch (err) {
        return res.status(500).json({
            status: 500,
            message: "failed",
            data: err.message
        });
    }
}

exports.updateStock = async (req, res, next) => {
    logger.info(req.path);
    logger.info(JSON.stringify(req.body));

    try {
        //const customerId = req.body.jwt.customerId;

        return res.json({
            status: 200,
            message: 'success',
            data: []
        });
    }
    catch (err) {
        logger.error(err.message + " " + JSON.stringify(err));

        return res.status(500).json({
            status: 500,
            message: "failed",
            data: err.message
        });
    }
}
