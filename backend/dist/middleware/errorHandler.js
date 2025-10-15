"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.notFound = exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, _req, res, _next) => {
    logger_1.default.error(`Error: ${err.message}`, { stack: err.stack });
    if (err instanceof errors_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            message: err.message
        });
    }
    // Mongoose duplicate key error
    if (err.name === 'MongoServerError' && err.code === 11000) {
        return res.status(409).json({
            success: false,
            error: 'Duplicate Entry',
            message: 'A record with this information already exists'
        });
    }
    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            error: 'Invalid ID format'
        });
    }
    // Default error
    return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
const notFound = (req, res, _next) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
};
exports.notFound = notFound;
const requestLogger = (req, _res, next) => {
    logger_1.default.http(`${req.method} ${req.url}`);
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=errorHandler.js.map