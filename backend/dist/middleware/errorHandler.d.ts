import { Request, Response, NextFunction } from 'express';
export declare const errorHandler: (err: Error, _req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>>;
export declare const notFound: (req: Request, res: Response, _next: NextFunction) => void;
export declare const requestLogger: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map