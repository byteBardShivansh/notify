import { Router, Request, Response, NextFunction } from 'express';
import { NotificationSchema } from '../schemas/notification.schema';
import { enqueue } from '../core/queue.service';

const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = NotificationSchema.parse(req.body);
    enqueue(notification);
    res.status(202).send({ message: 'Notification accepted for processing' });
  } catch (error) {
    next(error);
  }
});

export { router as notificationRouter };
