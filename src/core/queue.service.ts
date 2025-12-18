import { Notification } from '../schemas/notification.schema';

const queue: Notification[] = [];

export const enqueue = (notification: Notification): void => {
  console.log(`Enqueuing notification ${notification.notificationId}`);
  queue.push(notification);
};

export const dequeue = (): Notification | undefined => {
  const notification = queue.shift();
  if (notification) {
    console.log(`Dequeuing notification ${notification.notificationId}`);
  }
  return notification;
};
