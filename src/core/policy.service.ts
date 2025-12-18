import { promises as fs } from 'fs';
import path from 'path';
import { Notification } from '../schemas/notification.schema';

interface Policy {
  allowedTemplates: string[];
}

let policy: Policy;

const loadPolicy = async (): Promise<Policy> => {
  if (policy) {
    return policy;
  }
  const policyPath = path.join(process.cwd(), 'policies', 'default.json');
  try {
    const data = await fs.readFile(policyPath, 'utf-8');
    policy = JSON.parse(data);
    return policy;
  } catch (error) {
    console.error('Failed to load policy file, allowing all templates.', error);
    // Fallback to a permissive policy if the file is missing or invalid
    return { allowedTemplates: [] }; // Empty array means no templates are allowed unless we change logic
  }
};

// Load policy on startup
loadPolicy();

export const applyPolicies = async (notification: Notification): Promise<void> => {
  const currentPolicy = await loadPolicy();
  
  // If allowedTemplates is empty, we can interpret it as "allow all". Or we can be restrictive.
  // For this implementation, if the list has items, we enforce it.
  if (currentPolicy.allowedTemplates && currentPolicy.allowedTemplates.length > 0) {
    if (!currentPolicy.allowedTemplates.includes(notification.templateId)) {
      throw new Error(
        `Policy violation: Template ${notification.templateId} is not allowed.`
      );
    }
  }

  console.log(`Policies applied for notification ${notification.notificationId}`);
};
