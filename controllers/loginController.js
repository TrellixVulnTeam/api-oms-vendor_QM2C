const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const flux = require('../dbConnection').promise();
const logger = require('../logs');
const { encrypt } = require('../encryptor');

const secretKey = process.env.SECRET_KEY;

exports.login = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        logger.info("User : " + req.body.email + " " + errors.message);

        return res.status(422).json({ errors: errors.array() });
    }

    try {

        const [rows] = await flux.execute(
            "select u.id, u.name, u.email, customer_id, u.password From users u join userdetails d on u.id = d.user_id and d.is_active = 1 where u.is_active = 1 and u.email = ?",
            [req.body.email]
        );

        if (rows.length === 0) {
            logger.info("User : " + req.body.email + " Invalid email address");

            return res.status(422).json({
                message: "Users detail not found",
            });
        }

        const passMatch = await bcrypt.compare(req.body.password, rows[0].password);
        if (!passMatch) {
            logger.info("User : " + req.body.email + " Incorrect password");

            return res.status(422).json({
                message: "Incorrect password",
            });
        }

        let payload = {
            id: rows[0].id,
            name: rows[0].name,
            email: rows[0].email,
            details: []
        }

        for (const row of rows) {
            const customer = {
                customerId: row.customer_id
            }

            payload.details.push(customer)
        }

        payload = encrypt(JSON.stringify(payload));

        const theToken = jwt.sign(payload, secretKey, { expiresIn: '1d' });

        logger.info("User : " + req.body.email + " success login.");
        return res.json({
            token: theToken
        });

    }
    catch (err) {

        logger.error("User : " + req.body.email + " " + err.message + " " + JSON.stringify(err));

        return res.status(500).json({
            status: 500,
            message: "failed",
            data: err.message
        });
    }
}