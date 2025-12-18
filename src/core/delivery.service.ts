import { Notification } from '../schemas/notification.schema';
import { getTemplate } from './template.service';

export const deliver = async (notification: Notification): Promise<void> => {
  const template = await getTemplate(notification.templateId);
  if (!template) {
    // This should have been caught by the validation service, but as a safeguard:
    throw new Error(`Template with id ${notification.templateId} not found`);
  }

  // In a real implementation, this would use a delivery provider (e.g., SES, SendGrid).
  // Here, we'll just log the composed notification.
  let composedNotification = template.template;
  for (const key in notification.variables) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    composedNotification = composedNotification.replace(regex, notification.variables[key]);
  }

  console.log('--- Delivering Notification ---');
  console.log(`Recipient: ${notification.recipient}`);
  console.log('Body:');
  console.log(composedNotification);
  console.log('---------------------------');
};
