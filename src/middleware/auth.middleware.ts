import { Request, Response, NextFunction } from 'express';

const API_KEY = process.env.API_KEY || 'a-secure-api-key';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === API_KEY) {
    next();
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
};
