const { createLogger, format, transports } = require('winston');
require('winston-mongodb');

const logger = createLogger({
    transports: [
        new transports.Console({
            // Level of the message logging
            level: 'info'
        }),
        new transports.File({
            level: 'info',
            filename: 'logs/server.log',
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )
        }),
        //? MongoDB transport
        new transports.MongoDB({
            level: 'error',
            //? mongo database connection link
            db: 'mongodb://localhost/logs',
            options: {
                useUnifiedTopology: true
            },
            //? A collection to save json formatted logs
            collection: 'server_logs',
            format: format.combine(
                format.timestamp(),
                //? Convert logs to a json format
                format.json())
        })
    ]
});

function processHandler() {
    // ilinmay qolgan hatolarni bashqarish uchun
    console.log('log');
    process.on('uncaughtException', exceptions => {
        console.log(exceptions);
        logger.error(exceptions.message, exceptions);
        logger.on('finish', () => {
            process.exit(1);
        });
    });

    //rejection handler hatolarni boshqarish uchun 
    process.on('unhandledRejection', exceptions => {
        throw 'unhandledRejection xatosi \n' + exceptions.message + '  \n' + exceptions
    })

}

module.exports = { logger, processHandler }