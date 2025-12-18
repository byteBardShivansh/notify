import { applyPolicies } from '../../src/core/policy.service';
import { Notification } from '../../src/schemas/notification.schema';
import { promises as fs } from 'fs';
import path from 'path';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

const mockReadFile = fs.readFile as jest.Mock;

describe('Policy Service', () => {
  beforeEach(() => {
    jest.resetModules(); // Clears the module cache, so policy is reloaded
  });

  it('should not throw an error if the template is allowed', async () => {
    const policy = {
      allowedTemplates: ['allowed-template'],
    };
    mockReadFile.mockResolvedValue(JSON.stringify(policy));

    const notification: Notification = {
      notificationId: 'c15a8f2a-9e1d-4e2a-8f3d-6b8d5e2e1a4f',
      templateId: 'allowed-template',
      recipient: 'test@example.com',
      variables: {},
    };

    // We need to re-import applyPolicies to get the new instance with the mocked policy
    const { applyPolicies: applyPoliciesScoped } = await import('../../src/core/policy.service');
    await expect(applyPoliciesScoped(notification)).resolves.not.toThrow();
  });

  it('should throw an error if the template is not allowed', async () => {
    const policy = {
        allowedTemplates: ['allowed-template'],
      };
    mockReadFile.mockResolvedValue(JSON.stringify(policy));
    
    const notification: Notification = {
        notificationId: 'c15a8f2a-9e1d-4e2a-8f3d-6b8d5e2e1a4f',
        templateId: 'disallowed-template',
        recipient: 'test@example.com',
        variables: {},
    };

    const { applyPolicies: applyPoliciesScoped } = await import('../../src/core/policy.service');
    await expect(applyPoliciesScoped(notification)).rejects.toThrow(
        'Policy violation: Template disallowed-template is not allowed.'
    );
  });

  it('should allow any template if allowedTemplates is empty', async () => {
    const policy = {
        allowedTemplates: [],
      };
    mockReadFile.mockResolvedValue(JSON.stringify(policy));

    const notification: Notification = {
        notificationId: 'c15a8f2a-9e1d-4e2a-8f3d-6b8d5e2e1a4f',
        templateId: 'any-template',
        recipient: 'test@example.com',
        variables: {},
    };
    const { applyPolicies: applyPoliciesScoped } = await import('../../src/core/policy.service');
    await expect(applyPoliciesScoped(notification)).resolves.not.toThrow();
  });
});
