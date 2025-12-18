import { promises as fs } from 'fs';
import path from 'path';
import { Template } from '../schemas/template.schema';

const templatesDir = path.join(process.cwd(), 'templates');

const ensureTemplatesDir = async () => {
  try {
    await fs.access(templatesDir);
  } catch {
    await fs.mkdir(templatesDir, { recursive: true });
  }
};

export const listTemplates = async (): Promise<string[]> => {
    await ensureTemplatesDir();
    const files = await fs.readdir(templatesDir);
    return files.map(file => path.basename(file, '.json'));
}

export const saveTemplate = async (template: Template): Promise<void> => {
  await ensureTemplatesDir();
  const filePath = path.join(templatesDir, `${template.templateId}.json`);
  try {
      await fs.access(filePath);
      throw new Error(`Template with id ${template.templateId} already exists. Use update endpoint.`);
  } catch (error: any) {
      if (error.code !== 'ENOENT') {
          throw error;
      }
  }
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

export const updateTemplate = async (template: Template): Promise<Template> => {
    const filePath = path.join(templatesDir, `${template.templateId}.json`);
    try {
        await fs.access(filePath);
        await fs.writeFile(filePath, JSON.stringify(template, null, 2));
        return template;
    } catch (error) {
        throw new Error(`Template with id ${template.templateId} not found.`);
    }
}

export const deleteTemplate = async (templateId: string): Promise<void> => {
    const filePath = path.join(templatesDir, `${templateId}.json`);
    try {
        await fs.unlink(filePath);
    } catch (error) {
        throw new Error(`Template with id ${templateId} not found.`);
    }
}
