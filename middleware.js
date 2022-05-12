const jwt = require('jsonwebtoken');
const { decrypt } = require('./encryptor');
const logger = require('./logs')

const secretKey = process.env.SECRET_KEY;

exports.mdw = async (req, res, next) => {

    try {

        if (
            !req.headers.authorization ||
            !req.headers.authorization.startsWith('Bearer') ||
            !req.headers.authorization.split(' ')[1]
        ) {
            return res.status(401).json({
                status: 401,
                message: "failed",
                data: "Please provide the token",
            });
        }

        const theToken = req.headers.authorization.split(' ')[1];
        let payload = jwt.verify(theToken, secretKey);

        payload = JSON.parse(decrypt(payload));

        const token = {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            details: payload.details
        }

        req.body.jwt = token;
        next();

    } catch (err) {
        logger.error(err.message);

        return res.status(500).json({
            status: 500,
            message: "failed",
            data: err.message
        });
    }
};