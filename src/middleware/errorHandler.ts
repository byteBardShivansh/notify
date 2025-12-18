import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
  }));
  res.status(500).send('Internal Server Error');
};
