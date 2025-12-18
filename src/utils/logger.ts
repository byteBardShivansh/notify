import { Request, Response, NextFunction } from 'express';

export const structuredLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  }));
  next();
};
