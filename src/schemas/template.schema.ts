import { z } from 'zod';

export const TemplateSchema = z.object({
  templateId: z.string(),
  template: z.string(),
  requiredVariables: z.array(z.string()),
});

export type Template = z.infer<typeof TemplateSchema>;
