import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { logEvent } from './logger';

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler: ErrorRequestHandler = (
    err: AppError | Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError && err.isOperational) {
        logEvent('Operational Error', { message: err.message, statusCode: err.statusCode });
        res.status(err.statusCode).json({ error: err.message });
    } else {
        logEvent('Unknown Error', { message: err.message, stack: err.stack });
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
};
