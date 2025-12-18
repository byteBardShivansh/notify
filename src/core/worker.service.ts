import { dequeue } from './queue.service';
import { validate } from './validation.service';
import { applyPolicies } from './policy.service';
import { deliver } from './delivery.service';

const processQueue = async () => {
  const notification = dequeue();
  if (notification) {
    try {
      console.log(`Processing notification ${notification.notificationId}`);
      await validate(notification);
      await applyPolicies(notification);
      await deliver(notification);
      console.log(`Successfully processed notification ${notification.notificationId}`);
    } catch (error) {
      console.error(
        `Failed to process notification ${notification.notificationId}:`,
        error
      );
    }
  }
};

const startWorker = (interval: number = 5000) => {
  console.log('Notification worker started');
  setInterval(processQueue, interval);
};

export { startWorker };
