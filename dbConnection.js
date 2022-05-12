const mysql = require("mysql2");
const logger = require('./logs');

// const db_connection = mysql
//   .createConnection({
//     host    : "localhost",   // HOST NAME
//     user    : "root",        // USER NAME
//     database: "auth_db",     // DATABASE NAME
//     password: "",            // DATABASE PASSWORD
//   })
//   .on("error", (err) => {
//     console.log("Failed to connect to Database - ", err);
//   });

//const db_dev = mysql
//  .createConnection({
//    host    : "test-jv-tab-anteraja.ct7sy4jktszp.ap-southeast-1.rds.amazonaws.com",   // HOST NAME
//    user    : "flux_dev_user",        // USER NAME
//    database: "flux-dev",     // DATABASE NAME
//    password: "c!Vq>63!Z2}]zHby",            // DATABASE PASSWORD
//  })
//  .on("error", (err) => {
//    console.log("Failed to connect to Database Dev - ", err);
//  });


const db_dev = new mysql
    .createConnection({
        host    : "test-jv-tab-anteraja.ct7sy4jktszp.ap-southeast-1.rds.amazonaws.com", // HOST NAME
        user    : "fluxuser", // USER NAME
        database: "flux", // DATABASE NAME
        password: "fluxSIT%$2274", // DATABASE PASSWORD
    })
    .on("error", (err) => {
        logger.error("Failed to connect to Database Flux - ", err);
     });

// module.exports = db_connection;
module.exports = db_dev;
