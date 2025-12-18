import { deliver } from '../../src/core/delivery.service';
import { getTemplate } from '../../src/core/template.service';
import { Notification } from '../../src/schemas/notification.schema';
import { Template } from '../../src/schemas/template.schema';

jest.mock('../../src/core/template.service');

const mockGetTemplate = getTemplate as jest.Mock;

describe('Delivery Service', () => {
  it('should log the composed notification', async () => {
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

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await deliver(notification);

    expect(consoleSpy).toHaveBeenCalledWith('--- Delivering Notification ---');
    expect(consoleSpy).toHaveBeenCalledWith('Recipient: test@example.com');
    expect(consoleSpy).toHaveBeenCalledWith('Body:');
    expect(consoleSpy).toHaveBeenCalledWith('Hello Test User');
    expect(consoleSpy).toHaveBeenCalledWith('---------------------------');

    consoleSpy.mockRestore();
  });

  it('should throw an error if the template is not found', async () => {
    mockGetTemplate.mockResolvedValue(null);

    const notification: Notification = {
      notificationId: 'c15a8f2a-9e1d-4e2a-8f3d-6b8d5e2e1a4f',
      templateId: 'non-existent-template',
      recipient: 'test@example.com',
      variables: {},
    };

    await expect(deliver(notification)).rejects.toThrow(
      'Template with id non-existent-template not found'
    );
  });
});
