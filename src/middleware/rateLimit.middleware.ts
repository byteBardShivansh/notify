import { Request, Response, NextFunction } from 'express';

const requests: { [key: string]: number[] } = {};
const limit = 100; // 100 requests
const windowMs = 15 * 60 * 1000; // 15 minutes

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip;
  const now = Date.now();

  if (!requests[ip]) {
    requests[ip] = [];
  }

  requests[ip] = requests[ip].filter(timestamp => timestamp > now - windowMs);

  if (requests[ip].length >= limit) {
    return res.status(429).send({ message: 'Too many requests' });
  }

  requests[ip].push(now);
  next();
};
