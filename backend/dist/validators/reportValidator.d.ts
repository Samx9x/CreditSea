import { z } from 'zod';
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        uploadedAt: "uploadedAt";
        reportDate: "reportDate";
        creditScore: "creditScore";
    }>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
}, z.core.$strip>;
export declare const reportIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const creditScoreFilterSchema: z.ZodObject<{
    minScore: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number | undefined, string | undefined>>;
    maxScore: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number | undefined, string | undefined>>;
    pan: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type ReportIdParam = z.infer<typeof reportIdSchema>;
export type CreditScoreFilter = z.infer<typeof creditScoreFilterSchema>;
//# sourceMappingURL=reportValidator.d.ts.map