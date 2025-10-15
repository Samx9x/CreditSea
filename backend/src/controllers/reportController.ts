import { Request, Response } from 'express';
import fs from 'fs';
import CreditReport from '../models/CreditReport';
import xmlParserService from '../services/xmlParserService';
import { asyncHandler } from '../utils/asyncHandler';
import { ValidationError, NotFoundError } from '../utils/errors';
import { cleanupFile } from '../middleware/upload';
import logger from '../utils/logger';
import { paginationSchema, reportIdSchema, creditScoreFilterSchema } from '../validators/reportValidator';

/**
 * Upload and process XML credit report
 * POST /api/v1/reports/upload
 */
export const uploadReport = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    throw new ValidationError('No file uploaded. Please upload an XML file');
  }

  try {
    logger.info(`Processing uploaded file: ${file.filename}`);

    // Read XML file
    const xmlContent = fs.readFileSync(file.path, 'utf-8');

    // Parse and extract data
    const extractedData = await xmlParserService.extractAllData(xmlContent);

    // Save to database
    const creditReport = new CreditReport(extractedData);
    await creditReport.save();

    logger.info(`Credit report saved successfully: ${creditReport._id}`);

    // Clean up uploaded file
    cleanupFile(file.path);

    res.status(201).json({
      success: true,
      message: 'Credit report processed successfully',
      data: creditReport
    });
  } catch (error: any) {
    // Clean up file in case of error
    if (file) {
      cleanupFile(file.path);
    }
    throw error;
  }
});

/**
 * Get all credit reports with pagination and filtering
 * GET /api/v1/reports
 */
export const getAllReports = asyncHandler(async (req: Request, res: Response) => {
  // Validate query parameters
  const { page, limit, sortBy, sortOrder } = paginationSchema.parse(req.query);
  const { minScore, maxScore, pan } = creditScoreFilterSchema.parse(req.query);

  // Build query filter
  const filter: any = {};

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
  const sort: any = {};
  if (sortBy === 'creditScore') {
    sort['basicDetails.creditScore'] = sortOrder === 'asc' ? 1 : -1;
  } else if (sortBy === 'reportDate') {
    sort.reportDate = sortOrder === 'asc' ? 1 : -1;
  } else {
    sort.uploadedAt = sortOrder === 'asc' ? 1 : -1;
  }

  // Execute query
  const [reports, total] = await Promise.all([
    CreditReport.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    CreditReport.countDocuments(filter)
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
export const getReportById = asyncHandler(async (req: Request, res: Response) => {
  // Validate ID parameter
  const { id } = reportIdSchema.parse(req.params);

  const report = await CreditReport.findById(id).lean();

  if (!report) {
    throw new NotFoundError(`Credit report with ID ${id} not found`);
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
export const deleteReport = asyncHandler(async (req: Request, res: Response) => {
  // Validate ID parameter
  const { id } = reportIdSchema.parse(req.params);

  const report = await CreditReport.findByIdAndDelete(id);

  if (!report) {
    throw new NotFoundError(`Credit report with ID ${id} not found`);
  }

  logger.info(`Credit report deleted: ${id}`);

  res.status(200).json({
    success: true,
    message: 'Credit report deleted successfully'
  });
});

/**
 * Get report statistics
 * GET /api/v1/reports/stats
 */
export const getReportStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await CreditReport.aggregate([
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
