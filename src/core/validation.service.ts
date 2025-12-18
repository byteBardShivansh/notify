import { Notification } from '../schemas/notification.schema';
import { getTemplate } from './template.service';

export const validate = async (notification: Notification): Promise<void> => {
  const template = await getTemplate(notification.templateId);

  if (!template) {
    throw new Error(`Template with id ${notification.templateId} not found`);
  }

  for (const requiredVariable of template.requiredVariables) {
    if (!notification.variables.hasOwnProperty(requiredVariable)) {
      throw new Error(`Missing required variable: ${requiredVariable}`);
    }
  }
};
