import express, { Express, Request, Response } from 'express';
import { notificationRouter } from './api/notification.controller';
import { templateRouter } from './api/template.controller';
import { errorHandler } from './middleware/errorHandler';
import { structuredLogger } from './utils/logger';
import { authMiddleware } from './middleware/auth.middleware';
import { rateLimiter } from './middleware/rateLimit.middleware';

const app: Express = express();

app.use(express.json());
app.use(structuredLogger);
app.use(rateLimiter);

app.use('/api', authMiddleware);
app.use('/api/notifications', notificationRouter);
app.use('/api/templates', templateRouter);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.use(errorHandler);

export { app };
