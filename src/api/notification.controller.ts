import { Router, Request, Response, NextFunction } from 'express';
import { NotificationSchema } from '../schemas/notification.schema';
import { validate } from '../core/validation.service';
import { applyPolicies } from '../core/policy.service';
import { deliver } from '../core/delivery.service';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = NotificationSchema.parse(req.body);
    await validate(notification);
    await applyPolicies(notification);
    await deliver(notification);
    res.status(202).send({ message: 'Notification accepted' });
  } catch (error) {
    next(error);
  }
});

export { router as notificationRouter };
