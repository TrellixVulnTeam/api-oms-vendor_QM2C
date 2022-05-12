const winston         = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');


const timezone = () => {
    let date = new Date();
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
};

const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({format: timezone}),
    winston.format.align(),
    winston.format.printf(
        info => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

const transport = new DailyRotateFile({
    filename     : 'logs/apigateway-%DATE%.log',
    datePattern  : 'YYYYMMDD',
    zippedArchive: true,
    maxSize      : '20m',
    maxFiles     : '14d'
});


transport.on('rotate', function (oldFilename, newFilename) {
    // call function like upload to s3 or on cloud
    console.log(oldFilename, newFilename);
});


const logger = winston.createLogger({
    format: logFormat,
    transports: [
        transport
        //new winston.transports.Console({ level: 'info', })
    ]
});


module.exports = logger;