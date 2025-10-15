"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportStats = exports.deleteReport = exports.getReportById = exports.getAllReports = exports.uploadReport = void 0;
const fs_1 = __importDefault(require("fs"));
const CreditReport_1 = __importDefault(require("../models/CreditReport"));
const xmlParserService_1 = __importDefault(require("../services/xmlParserService"));
const asyncHandler_1 = require("../utils/asyncHandler");
const errors_1 = require("../utils/errors");
const upload_1 = require("../middleware/upload");
const logger_1 = __importDefault(require("../utils/logger"));
const reportValidator_1 = require("../validators/reportValidator");
/**
 * Upload and process XML credit report
 * POST /api/v1/reports/upload
 */
exports.uploadReport = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const file = req.file;
    if (!file) {
        throw new errors_1.ValidationError('No file uploaded. Please upload an XML file');
    }
    try {
        logger_1.default.info(`Processing uploaded file: ${file.filename}`);
        // Read XML file
        const xmlContent = fs_1.default.readFileSync(file.path, 'utf-8');
        // Parse and extract data
        const extractedData = await xmlParserService_1.default.extractAllData(xmlContent);
        // Save to database
        const creditReport = new CreditReport_1.default(extractedData);
        await creditReport.save();
        logger_1.default.info(`Credit report saved successfully: ${creditReport._id}`);
        // Clean up uploaded file
        (0, upload_1.cleanupFile)(file.path);
        res.status(201).json({
            success: true,
            message: 'Credit report processed successfully',
            data: creditReport
        });
    }
    catch (error) {
        // Clean up file in case of error
        if (file) {
            (0, upload_1.cleanupFile)(file.path);
        }
        throw error;
    }
});
/**
 * Get all credit reports with pagination and filtering
 * GET /api/v1/reports
 */
exports.getAllReports = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Validate query parameters
    const { page, limit, sortBy, sortOrder } = reportValidator_1.paginationSchema.parse(req.query);
    const { minScore, maxScore, pan } = reportValidator_1.creditScoreFilterSchema.parse(req.query);
    // Build query filter
    const filter = {};
    if (minScore !== undefined || maxScore !== undefined) {
        filter['basicDetails.creditScore'] = {};
        if (minScore !== undefined) {
            filter['basicDetails.creditScore'].$gte = minScore;
        }
        if (maxScore !== undefined) {
            filter['basicDetails.creditScore'].$lte = maxScore;
        }
    }
    if (pan) {
        filter['basicDetails.pan'] = pan.toUpperCase();
    }
    // Calculate skip
    const skip = (page - 1) * limit;
    // Build sort object
    const sort = {};
    if (sortBy === 'creditScore') {
        sort['basicDetails.creditScore'] = sortOrder === 'asc' ? 1 : -1;
    }
    else if (sortBy === 'reportDate') {
        sort.reportDate = sortOrder === 'asc' ? 1 : -1;
    }
    else {
        sort.uploadedAt = sortOrder === 'asc' ? 1 : -1;
    }
    // Execute query
    const [reports, total] = await Promise.all([
        CreditReport_1.default.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        CreditReport_1.default.countDocuments(filter)
    ]);
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
        success: true,
        data: reports,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    });
});
/**
 * Get credit report by ID
 * GET /api/v1/reports/:id
 */
exports.getReportById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Validate ID parameter
    const { id } = reportValidator_1.reportIdSchema.parse(req.params);
    const report = await CreditReport_1.default.findById(id).lean();
    if (!report) {
        throw new errors_1.NotFoundError(`Credit report with ID ${id} not found`);
    }
    res.status(200).json({
        success: true,
        data: report
    });
});
/**
 * Delete credit report by ID
 * DELETE /api/v1/reports/:id
 */
exports.deleteReport = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Validate ID parameter
    const { id } = reportValidator_1.reportIdSchema.parse(req.params);
    const report = await CreditReport_1.default.findByIdAndDelete(id);
    if (!report) {
        throw new errors_1.NotFoundError(`Credit report with ID ${id} not found`);
    }
    logger_1.default.info(`Credit report deleted: ${id}`);
    res.status(200).json({
        success: true,
        message: 'Credit report deleted successfully'
    });
});
/**
 * Get report statistics
 * GET /api/v1/reports/stats
 */
exports.getReportStats = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const stats = await CreditReport_1.default.aggregate([
        {
            $group: {
                _id: null,
                totalReports: { $sum: 1 },
                avgCreditScore: { $avg: '$basicDetails.creditScore' },
                maxCreditScore: { $max: '$basicDetails.creditScore' },
                minCreditScore: { $min: '$basicDetails.creditScore' },
                avgTotalAccounts: { $avg: '$reportSummary.totalAccounts' },
                avgActiveAccounts: { $avg: '$reportSummary.activeAccounts' },
                totalOutstandingBalance: { $sum: '$reportSummary.currentBalance' }
            }
        }
    ]);
    const result = stats.length > 0 ? stats[0] : {
        totalReports: 0,
        avgCreditScore: 0,
        maxCreditScore: 0,
        minCreditScore: 0,
        avgTotalAccounts: 0,
        avgActiveAccounts: 0,
        totalOutstandingBalance: 0
    };
    delete result._id;
    res.status(200).json({
        success: true,
        data: result
    });
});
//# sourceMappingURL=reportController.js.map