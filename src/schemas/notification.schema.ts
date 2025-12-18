import { z } from 'zod';

export const NotificationSchema = z.object({
  notificationId: z.string().uuid(),
  templateId: z.string(),
  recipient: z.string().email(),
  variables: z.record(z.any()),
});

export type Notification = z.infer<typeof NotificationSchema>;
