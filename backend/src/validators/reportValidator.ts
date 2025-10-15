import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  sortBy: z.enum(['uploadedAt', 'creditScore', 'reportDate']).optional().default('uploadedAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const reportIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid report ID format'),
});

export const creditScoreFilterSchema = z.object({
  minScore: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
  maxScore: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
  pan: z.string().optional(),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;
export type ReportIdParam = z.infer<typeof reportIdSchema>;
export type CreditScoreFilter = z.infer<typeof creditScoreFilterSchema>;
