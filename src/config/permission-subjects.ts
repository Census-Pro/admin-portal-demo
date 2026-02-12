/**
 * Available Actions for Permissions
 * These actions define what operations can be performed
 */
export const AVAILABLE_ACTIONS = [
  'manage', // Full control - includes all CRUD operations
  'create',
  'read',
  'update',
  'delete',
  'approve',
  'verify',
  'endorse',
  'export',
  'print'
] as const;

/**
 * Available Subjects for Permissions
 * These subjects correspond to menu items and features in the system
 * Each subject should match a sidebar menu item's 'subject' property
 */
export const AVAILABLE_SUBJECTS = [
  // Core System
  'all',
  'Dashboard',
  'User',

  // Roles & Permissions
  'Roles',
  'Permissions',
  'Roles & Permissions',

  // Master Data
  'Masters',
  'Agencies',
  'Office Locations',
  'Relationship Types',
  'Countries',
  'Dzongkhags',
  'Gewogs',
  'Cities',
  'Genders',
  'Marital Status',
  'Literacy Status',
  'Census Status',
  'Naturalization Types',
  'Regularization Types',
  'Relationship Certificate Purposes',

  // Birth Registration
  'Birth Registration',
  'Birth Registration Endorse',
  'Birth Registration Verify',
  'Birth Registration Approve',

  // Death Registration
  'Death Registration',
  'Death Registration Endorse',
  'Death Registration Verify',
  'Death Registration Approve'

  // Add more subjects as your Census system grows
] as const;

export type PermissionAction = (typeof AVAILABLE_ACTIONS)[number];
export type PermissionSubject = (typeof AVAILABLE_SUBJECTS)[number];

/**
 * Helper function to check if a subject exists
 */
export const isValidSubject = (
  subject: string
): subject is PermissionSubject => {
  return AVAILABLE_SUBJECTS.includes(subject as PermissionSubject);
};

/**
 * Helper function to check if an action exists
 */
export const isValidAction = (action: string): action is PermissionAction => {
  return AVAILABLE_ACTIONS.includes(action as PermissionAction);
};
