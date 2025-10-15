import { Request, Response } from 'express';
/**
 * Upload and process XML credit report
 * POST /api/v1/reports/upload
 */
export declare const uploadReport: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get all credit reports with pagination and filtering
 * GET /api/v1/reports
 */
export declare const getAllReports: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get credit report by ID
 * GET /api/v1/reports/:id
 */
export declare const getReportById: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Delete credit report by ID
 * DELETE /api/v1/reports/:id
 */
export declare const deleteReport: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get report statistics
 * GET /api/v1/reports/stats
 */
export declare const getReportStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=reportController.d.ts.map