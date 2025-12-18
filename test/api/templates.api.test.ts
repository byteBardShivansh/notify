import request from 'supertest';
import { app } from '../../src/app';
import { promises as fs } from 'fs';
import path from 'path';

const templatesDir = path.join(process.cwd(), 'templates');
const apiKey = process.env.API_KEY || 'a-secure-api-key';

describe('Template API', () => {
    beforeAll(async () => {
        // Ensure the templates directory is clean before tests
        try {
            await fs.rm(templatesDir, { recursive: true, force: true });
        } catch (error) {}
    });

    afterEach(async () => {
        try {
            await fs.rm(templatesDir, { recursive: true, force: true });
        } catch (error) {}
    });

  it('should return an empty array when no templates exist', async () => {
    const res = await request(app)
        .get('/api/templates')
        .set('x-api-key', apiKey);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new template', async () => {
    const template = {
      templateId: 'welcome',
      template: 'Hello {{name}}',
      requiredVariables: ['name'],
    };
    const res = await request(app)
      .post('/api/templates')
      .set('x-api-key', apiKey)
      .send(template);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({ message: 'Template saved' });

    const getRes = await request(app)
        .get('/api/templates/welcome')
        .set('x-api-key', apiKey);
    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body).toEqual(template);
  });

  it('should return 409 when creating a template that already exists', async () => {
    const template = {
        templateId: 'welcome',
        template: 'Hello {{name}}',
        requiredVariables: ['name'],
      };
    await request(app)
        .post('/api/templates')
        .set('x-api-key', apiKey)
        .send(template);

    const res = await request(app)
        .post('/api/templates')
        .set('x-api-key', apiKey)
        .send(template);
    expect(res.statusCode).toEqual(409);
    expect(res.body).toEqual({ message: 'Template with id welcome already exists. Use update endpoint.' });
  });
  
  it('should update a template', async () => {
    const template = {
      templateId: 'welcome',
      template: 'Hello {{name}}',
      requiredVariables: ['name'],
    };
    await request(app)
        .post('/api/templates')
        .set('x-api-key', apiKey)
        .send(template);

    const updatedTemplate = {
        templateId: 'welcome',
        template: 'Hi {{name}}',
        requiredVariables: ['name', 'location'],
      };
    const res = await request(app)
      .put('/api/templates/welcome')
      .set('x-api-key', apiKey)
      .send(updatedTemplate);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(updatedTemplate);

    const getRes = await request(app)
        .get('/api/templates/welcome')
        .set('x-api-key', apiKey);
    expect(getRes.body).toEqual(updatedTemplate);
  });

  it('should return 400 on update if templateId in body does not match url', async () => {
    const res = await request(app)
      .put('/api/templates/welcome')
      .set('x-api-key', apiKey)
      .send({ templateId: 'different' });
    expect(res.statusCode).toEqual(400);
  });

  it('should delete a template', async () => {
    const template = {
        templateId: 'welcome',
        template: 'Hello {{name}}',
        requiredVariables: ['name'],
      };
    await request(app)
        .post('/api/templates')
        .set('x-api-key', apiKey)
        .send(template);

    const res = await request(app)
        .delete('/api/templates/welcome')
        .set('x-api-key', apiKey);
    expect(res.statusCode).toEqual(204);

    const getRes = await request(app)
        .get('/api/templates/welcome')
        .set('x-api-key', apiKey);
    expect(getRes.statusCode).toEqual(404);
  });
});
