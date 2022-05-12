require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const logger = require("./logs");
const app     = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(routes);
// Handling Errors
app.use((err, req, res, next) => {
    logger.error(err.message + ' ' + JSON.stringify(err));
    err.statusCode = err.statusCode || 500;
    err.message    = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});

app.listen(PORT, () => console.log('Server is running on port ' + PORT));