import { createLogger, format, transports } from 'winston';
import path from 'path';

const logPath = path.join(__dirname, '../../logs.txt');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message, ...meta }) => {
            const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
            return `[${timestamp}] [${level.toUpperCase()}]: ${message} ${metaString}`;
        })
    ),
    transports: [
        new transports.File({ filename: logPath }),
        new transports.Console()
    ]
});

export const logEvent = (eventType: string, data: any, level: string = 'info') => {
    logger.log({ level, message: eventType, ...data });
};

export default logger;
