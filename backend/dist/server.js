"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const database_1 = __importDefault(require("./config/database"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = __importDefault(require("./utils/logger"));
// Create Express app
const app = (0, express_1.default)();
// Ensure logs directory exists
const logsDir = path_1.default.join(__dirname, '../logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
// Connect to MongoDB
(0, database_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});
// Apply rate limiting to API routes
app.use('/api/', limiter);
// File upload rate limiting (more restrictive)
const uploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 uploads per hour
    message: 'Too many file uploads from this IP, please try again later',
});
app.use('/api/v1/reports/upload', uploadLimiter);
// Body parser middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Request logging
app.use(errorHandler_1.requestLogger);
// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Credit Report Processor API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '2.0.0'
    });
});
// API routes (v1)
app.use('/api/v1/reports', reportRoutes_1.default);
// Legacy API routes (for backward compatibility)
app.use('/api/reports', reportRoutes_1.default);
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../frontend/dist')));
    app.get('*', (_req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, '../../frontend/dist', 'index.html'));
    });
}
// 404 handler
app.use(errorHandler_1.notFound);
// Global error handler
app.use(errorHandler_1.errorHandler);
// Start server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    logger_1.default.info(`
╔════════════════════════════════════════════════════════╗
║   Credit Report Processor API v2.0.0                   ║
╠════════════════════════════════════════════════════════╣
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(42)}║
║   Port: ${String(PORT).padEnd(47)}║
║   Health: http://localhost:${PORT}/health${' '.repeat(23)}║
║   API v1: http://localhost:${PORT}/api/v1${' '.repeat(24)}║
╚════════════════════════════════════════════════════════╝
  `);
});
// Graceful shutdown
const gracefulShutdown = (signal) => {
    logger_1.default.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
        logger_1.default.info('HTTP server closed');
        process.exit(0);
    });
    // Force close after 10 seconds
    setTimeout(() => {
        logger_1.default.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};
// Handle process signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger_1.default.error(`Unhandled Promise Rejection: ${err.message}`);
    logger_1.default.error(err.stack || '');
    gracefulShutdown('UnhandledRejection');
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger_1.default.error(`Uncaught Exception: ${err.message}`);
    logger_1.default.error(err.stack || '');
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=server.js.map