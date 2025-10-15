"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creditScoreFilterSchema = exports.reportIdSchema = exports.paginationSchema = void 0;
const zod_1 = require("zod");
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    sortBy: zod_1.z.enum(['uploadedAt', 'creditScore', 'reportDate']).optional().default('uploadedAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('desc'),
});
exports.reportIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid report ID format'),
});
exports.creditScoreFilterSchema = zod_1.z.object({
    minScore: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
    maxScore: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
    pan: zod_1.z.string().optional(),
});
//# sourceMappingURL=reportValidator.js.map