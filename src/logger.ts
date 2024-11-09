import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

const logger = createLogger({
    level: "info",
    format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "combined.log" }),
    ],
});

export default logger;
