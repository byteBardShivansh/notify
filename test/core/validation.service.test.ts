import { validate } from '../../src/core/validation.service';
import { getTemplate } from '../../src/core/template.service';
import { Notification } from '../../src/schemas/notification.schema';
import { Template } from '../../src/schemas/template.schema';

jest.mock('../../src/core/template.service');

const mockGetTemplate = getTemplate as jest.Mock;

describe('Validation Service', () => {
  it('should pass validation if all required variables are present', async () => {
    const template: Template = {
      templateId: 'test-template',
      template: 'Hello {{name}}',
      requiredVariables: ['name'],
    };
    mockGetTemplate.mockResolvedValue(template);

    const notification: Notification = {
      notificationId: 'c15a8f2a-9e1d-4e2a-8f3d-6b8d5e2e1a4f',
      templateId: 'test-template',
      recipient: 'test@example.com',
      variables: {
        name: 'Test User',
      },
    };

    await expect(validate(notification)).resolves.not.toThrow();
  });

  it('should throw an error if the template does not exist', async () => {
    mockGetTemplate.mockResolvedValue(null);

    const notification: Notification = {
      notificationId: 'c15a8f2a-9e1d-4e2a-8f3d-6b8d5e2e1a4f',
      templateId: 'non-existent-template',
      recipient: 'test@example.com',
      variables: {},
    };

    await expect(validate(notification)).rejects.toThrow(
      'Template with id non-existent-template not found'
    );
  });

  it('should throw an error if a required variable is missing', async () => {
    const template: Template = {
      templateId: 'test-template',
      template: 'Hello {{name}}',
      requiredVariables: ['name'],
    };
    mockGetTemplate.mockResolvedValue(template);

    const notification: Notification = {
      notificationId: 'c15a8f2a-9e1d-4e2a-8f3d-6b8d5e2e1a4f',
      templateId: 'test-template',
      recipient: 'test@example.com',
      variables: {},
    };

    await expect(validate(notification)).rejects.toThrow(
      'Missing required variable: name'
    );
  });
});
