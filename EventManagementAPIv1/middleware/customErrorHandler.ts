import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    status?: number;
};

const customErrorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500;
    const errorMessage = error.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: statusCode,
        message: errorMessage
    });
};

export {customErrorHandler, CustomError};