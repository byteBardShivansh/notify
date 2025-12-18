import { Router, Request, Response, NextFunction } from 'express';
import { TemplateSchema } from '../schemas/template.schema';
import { getTemplate, saveTemplate, updateTemplate, deleteTemplate, listTemplates } from '../core/template.service';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const templateIds = await listTemplates();
        res.status(200).send(templateIds);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const template = TemplateSchema.parse(req.body);
    await saveTemplate(template);
    res.status(201).send({ message: 'Template saved' });
  } catch (error: any) {
    if (error.message.includes('already exists')) {
        return res.status(409).send({ message: error.message });
    }
    next(error);
  }
});

router.get('/:templateId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const template = await getTemplate(req.params.templateId);
    if (!template) {
      return res.status(404).send({ message: 'Template not found' });
    }
    res.status(200).send(template);
  } catch (error) {
    next(error);
  }
});

router.put('/:templateId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const template = TemplateSchema.parse(req.body);
        if (template.templateId !== req.params.templateId) {
            return res.status(400).send({ message: 'Template ID in body does not match URL' });
        }
        const updatedTemplate = await updateTemplate(template);
        res.status(200).send(updatedTemplate);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            return res.status(404).send({ message: error.message });
        }
        next(error);
    }
});

router.delete('/:templateId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteTemplate(req.params.templateId);
        res.status(204).send();
    } catch (error: any) {
        if (error.message.includes('not found')) {
            return res.status(404).send({ message: error.message });
        }
        next(error);
    }
});

export { router as templateRouter };
