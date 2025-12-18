import { Router, Request, Response, NextFunction } from 'express';
import { TemplateSchema } from '../schemas/template.schema';
import { getTemplate, saveTemplate } from '../core/template.service';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const template = TemplateSchema.parse(req.body);
    await saveTemplate(template);
    res.status(201).send({ message: 'Template saved' });
  } catch (error) {
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

export { router as templateRouter };
