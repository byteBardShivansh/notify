import { promises as fs } from 'fs';
import path from 'path';
import { Template } from '../schemas/template.schema';

const templatesDir = path.join(process.cwd(), 'templates');

const ensureTemplatesDir = async () => {
  try {
    await fs.access(templatesDir);
  } catch {
    await fs.mkdir(templatesDir);
  }
};

export const saveTemplate = async (template: Template): Promise<void> => {
  await ensureTemplatesDir();
  const filePath = path.join(templatesDir, `${template.templateId}.json`);
  await fs.writeFile(filePath, JSON.stringify(template, null, 2));
};

export const getTemplate = async (templateId: string): Promise<Template | null> => {
  const filePath = path.join(templatesDir, `${templateId}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as Template;
  } catch (error) {
    return null;
  }
};
