/**
 * Available Actions for Permissions
 * These actions define what operations can be performed
 */
export const AVAILABLE_ACTIONS = [
  'create',
  'read',
  'update',
  'delete',
  'manage', // Full control
  'approve',
  'reject',
  'verify',
  'export',
  'print',
  'review',
  'assess',
  'payment',
  'issue',
  'add',
  'scan',
  'registration',
  'vetting'
] as const;

/**
 * Available Subjects for Permissions
 * These subjects correspond to menu items and features in the system
 * Each subject should match a sidebar menu item's 'subject' property
 */
export const AVAILABLE_SUBJECTS = [
  // Core System
  'Dashboard',
  'User',
  'Role Permission',

  // Masters
  'Master',
  'Flight',
  'Checkpoints',

  // Visa & Permits
  'Visa',
  'Tourist Visa',
  'Regional Tourist Visa',
  'International Tourist Visa',
  'Fast Track Visa',
  'Regional Fast Track Visa',
  'International Fast Track Visa',
  'Non Tourist Visa',
  'Non Tourist Conversion',
  'BIF',

  // On Arrival
  'Air Arrival',
  'Land Arrival',
  'On Arrival Extension',
  'On Arrival Pre Registration',

  // Border Management
  'Border Management',
  'Land BMS',
  'Air BMS',
  'Internal Checkpoint',
  'Casual Visitor',
  'Bhutanese Casual Visitor',
  'Vehicle Registration',
  'Vehicle Report',

  // Personal Guest
  'International Personal Guest',
  'Regional Personal Guest',

  // Route Permit
  'Route Permit',

  // Work Permit & Related
  'Work Permit',
  'Student Permit',
  'Dependent Permit',
  'Investor Permit',
  'Immigration Card',
  'Temporary Stay Permit',
  'Trader Permit',
  'Travel Permit',

  // Card & Registration
  'Card Printing',
  'Register Child',
  'Permit Replacement',
  'Permit Cancellation',

  // Enforcement
  'Deportation',
  'Repatriation',
  'Watchlist',
  'Blacklist',
  'Offence',

  // Information & Reports
  'Individual Information',
  'Report',
  'Challan Report',
  'Flight Report',
  'Individual Challan',
  'On Arrival Report',
  'TCB Report',
  'Non Tourist Report',
  'Permit Report',
  'Arrival Report',

  // Data Management
  'Data Correction',
  'Permit Correction',
  'Visa Correction',
  'Record Entry/Exit',
  'Application History',
  'Work Permit History',

  // Tools & Utilities
  'Tools',
  'Save Mode',
  'Enrollment'

  // Add more subjects as your system grows
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
