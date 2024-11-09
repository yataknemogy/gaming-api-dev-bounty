import { GenericError } from '../errors/errorHandling';
import logger from '../logger';
import { StatusCodes } from 'http-status-codes';

export function getRequestParam<T>(
    requestUrl: URL,
    param: string,
    required: boolean = true,
    validValues?: T[],
    defaultValue?: T,
): T {
    let value = requestUrl.searchParams.get(param);

    if (value === null && defaultValue !== undefined) {
        logger.info(`[getRequestParam] Parameter "${param}" not provided, using default value: ${defaultValue}`);
        return defaultValue;
    }

    if (required && value === null) {
        logger.error(`[getRequestParam] Missing required parameter: "${param}"`);
        throw new GenericError(`Missing required parameter: ${param}`, StatusCodes.BAD_REQUEST);
    }

    let finalValue: T;
    if (typeof defaultValue === "number" || (validValues && typeof validValues[0] === "number") || !isNaN(Number(value))) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
            throw new GenericError(`Parameter "${param}" must be a valid number`, StatusCodes.BAD_REQUEST);
        }
        finalValue = numValue as T;
    } else if (typeof defaultValue === "boolean" || (validValues && typeof validValues[0] === "boolean")) {
        finalValue = (value === "true") as T;
    } else {
        finalValue = value as T;
    }

    if (validValues && !validValues.includes(finalValue)) {
        throw new GenericError(`Invalid value for parameter: ${param}. Expected one of: ${validValues.join(", ")}`, StatusCodes.BAD_REQUEST);
    }

    logger.info(`[getRequestParam] Retrieved parameter "${param}": ${finalValue}`);
    return finalValue;
}

export const validateParameters = (paramName: string, condition: boolean, errorMsg: string) => {
    if (!condition) {
        logger.error(`[${paramName}] ${errorMsg}`);
        throw new GenericError(`[${paramName}] ${errorMsg}`, StatusCodes.BAD_REQUEST);
    }
};
