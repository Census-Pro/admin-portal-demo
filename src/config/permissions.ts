/**
 * Centralized Permission Constants
 *
 * This file defines all available permissions in the system.
 * Permissions follow the pattern: action:subject
 *
 * Actions: manage, view, create, edit, delete, verify, approve
 * Subjects: all, users, roles, permissions, birth-registration, cid-issuance, etc.
 */

// ============================================================================
// SUPER ADMIN PERMISSIONS
// ============================================================================

export const MANAGE_ALL = 'manage:all' as const;

// ============================================================================
// USER MANAGEMENT PERMISSIONS
// ============================================================================

export const VIEW_USERS = 'view:users' as const;
export const CREATE_USERS = 'create:users' as const;
export const EDIT_USERS = 'edit:users' as const;
export const DELETE_USERS = 'delete:users' as const;
export const MANAGE_USERS = 'manage:users' as const;

// ============================================================================
// ROLE & PERMISSION MANAGEMENT
// ============================================================================

export const VIEW_ROLES = 'view:roles' as const;
export const CREATE_ROLES = 'create:roles' as const;
export const EDIT_ROLES = 'edit:roles' as const;
export const DELETE_ROLES = 'delete:roles' as const;
export const MANAGE_ROLES = 'manage:roles' as const;

export const VIEW_PERMISSIONS = 'view:permissions' as const;
export const CREATE_PERMISSIONS = 'create:permissions' as const;
export const EDIT_PERMISSIONS = 'edit:permissions' as const;
export const DELETE_PERMISSIONS = 'delete:permissions' as const;
export const MANAGE_PERMISSIONS = 'manage:permissions' as const;

// ============================================================================
// BIRTH REGISTRATION PERMISSIONS
// ============================================================================

export const VIEW_BIRTH_REGISTRATION = 'view:birth-registration' as const;
export const CREATE_BIRTH_REGISTRATION = 'create:birth-registration' as const;
export const EDIT_BIRTH_REGISTRATION = 'edit:birth-registration' as const;
export const DELETE_BIRTH_REGISTRATION = 'delete:birth-registration' as const;
export const VERIFY_BIRTH_REGISTRATION = 'verify:birth-registration' as const;
export const APPROVE_BIRTH_REGISTRATION = 'approve:birth-registration' as const;
export const MANAGE_BIRTH_REGISTRATION = 'manage:birth-registration' as const;

// ============================================================================
// CID ISSUANCE PERMISSIONS
// ============================================================================

export const VIEW_CID_ISSUANCE = 'view:cid-issuance' as const;
export const CREATE_CID_ISSUANCE = 'create:cid-issuance' as const;
export const EDIT_CID_ISSUANCE = 'edit:cid-issuance' as const;
export const DELETE_CID_ISSUANCE = 'delete:cid-issuance' as const;
export const VERIFY_CID_ISSUANCE = 'verify:cid-issuance' as const;
export const APPROVE_CID_ISSUANCE = 'approve:cid-issuance' as const;
export const MANAGE_CID_ISSUANCE = 'manage:cid-issuance' as const;

// ============================================================================
// MOVE IN/OUT PERMISSIONS
// ============================================================================

export const VIEW_MOVE_IN_OUT = 'view:move-in-out' as const;
export const CREATE_MOVE_IN_OUT = 'create:move-in-out' as const;
export const EDIT_MOVE_IN_OUT = 'edit:move-in-out' as const;
export const DELETE_MOVE_IN_OUT = 'delete:move-in-out' as const;
export const VERIFY_MOVE_IN_OUT = 'verify:move-in-out' as const;
export const APPROVE_MOVE_IN_OUT = 'approve:move-in-out' as const;
export const MANAGE_MOVE_IN_OUT = 'manage:move-in-out' as const;

// ============================================================================
// RELATIONSHIPS PERMISSIONS
// ============================================================================

export const VIEW_RELATIONSHIPS = 'view:relationships' as const;
export const CREATE_RELATIONSHIPS = 'create:relationships' as const;
export const EDIT_RELATIONSHIPS = 'edit:relationships' as const;
export const DELETE_RELATIONSHIPS = 'delete:relationships' as const;
export const VERIFY_RELATIONSHIPS = 'verify:relationships' as const;
export const APPROVE_RELATIONSHIPS = 'approve:relationships' as const;
export const MANAGE_RELATIONSHIPS = 'manage:relationships' as const;

// ============================================================================
// NATURALIZATION/REGULARIZATION PERMISSIONS
// ============================================================================

export const VIEW_NATURALIZATION = 'view:naturalization' as const;
export const CREATE_NATURALIZATION = 'create:naturalization' as const;
export const EDIT_NATURALIZATION = 'edit:naturalization' as const;
export const DELETE_NATURALIZATION = 'delete:naturalization' as const;
export const VERIFY_NATURALIZATION = 'verify:naturalization' as const;
export const APPROVE_NATURALIZATION = 'approve:naturalization' as const;
export const MANAGE_NATURALIZATION = 'manage:naturalization' as const;

// ============================================================================
// DEATH REGISTRATION PERMISSIONS
// ============================================================================

export const VIEW_DEATH_REGISTRATION = 'view:death-registration' as const;
export const CREATE_DEATH_REGISTRATION = 'create:death-registration' as const;
export const EDIT_DEATH_REGISTRATION = 'edit:death-registration' as const;
export const DELETE_DEATH_REGISTRATION = 'delete:death-registration' as const;
export const VERIFY_DEATH_REGISTRATION = 'verify:death-registration' as const;
export const APPROVE_DEATH_REGISTRATION = 'approve:death-registration' as const;
export const MANAGE_DEATH_REGISTRATION = 'manage:death-registration' as const;

// ============================================================================
// COUNTRY PERMISSIONS
// ============================================================================

export const VIEW_COUNTRIES = 'view:countries' as const;
export const CREATE_COUNTRIES = 'create:countries' as const;
export const EDIT_COUNTRIES = 'edit:countries' as const;
export const DELETE_COUNTRIES = 'delete:countries' as const;
export const MANAGE_COUNTRIES = 'manage:countries' as const;

// ============================================================================
// DASHBOARD PERMISSIONS
// ============================================================================

export const VIEW_DASHBOARD = 'view:dashboard' as const;

// ============================================================================
// PERMISSION GROUPS (for convenience)
// ============================================================================

/**
 * Super Admin - Full access to everything
 */
export const SUPER_ADMIN_PERMISSIONS = [MANAGE_ALL] as const;

/**
 * Admin - Can view, create, edit, verify, approve but cannot delete
 */
export const ADMIN_PERMISSIONS = [
  VIEW_DASHBOARD,
  VIEW_USERS,
  CREATE_USERS,
  EDIT_USERS,
  MANAGE_USERS,
  VIEW_BIRTH_REGISTRATION,
  CREATE_BIRTH_REGISTRATION,
  EDIT_BIRTH_REGISTRATION,
  VERIFY_BIRTH_REGISTRATION,
  APPROVE_BIRTH_REGISTRATION,
  VIEW_CID_ISSUANCE,
  CREATE_CID_ISSUANCE,
  EDIT_CID_ISSUANCE,
  VERIFY_CID_ISSUANCE,
  APPROVE_CID_ISSUANCE,
  VIEW_MOVE_IN_OUT,
  CREATE_MOVE_IN_OUT,
  EDIT_MOVE_IN_OUT,
  VERIFY_MOVE_IN_OUT,
  APPROVE_MOVE_IN_OUT,
  VIEW_RELATIONSHIPS,
  CREATE_RELATIONSHIPS,
  EDIT_RELATIONSHIPS,
  VERIFY_RELATIONSHIPS,
  APPROVE_RELATIONSHIPS,
  VIEW_NATURALIZATION,
  CREATE_NATURALIZATION,
  EDIT_NATURALIZATION,
  VERIFY_NATURALIZATION,
  APPROVE_NATURALIZATION,
  VIEW_DEATH_REGISTRATION,
  CREATE_DEATH_REGISTRATION,
  EDIT_DEATH_REGISTRATION,
  VERIFY_DEATH_REGISTRATION,
  APPROVE_DEATH_REGISTRATION
] as const;

/**
 * Operator - Can view and verify but cannot approve or manage
 */
export const OPERATOR_PERMISSIONS = [
  VIEW_DASHBOARD,
  VIEW_BIRTH_REGISTRATION,
  VERIFY_BIRTH_REGISTRATION,
  VIEW_CID_ISSUANCE,
  VERIFY_CID_ISSUANCE,
  VIEW_MOVE_IN_OUT,
  VERIFY_MOVE_IN_OUT,
  VIEW_RELATIONSHIPS,
  VERIFY_RELATIONSHIPS,
  VIEW_NATURALIZATION,
  VERIFY_NATURALIZATION,
  VIEW_DEATH_REGISTRATION,
  VERIFY_DEATH_REGISTRATION
] as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Permission =
  | typeof MANAGE_ALL
  | typeof VIEW_USERS
  | typeof CREATE_USERS
  | typeof EDIT_USERS
  | typeof DELETE_USERS
  | typeof MANAGE_USERS
  | typeof VIEW_ROLES
  | typeof CREATE_ROLES
  | typeof EDIT_ROLES
  | typeof DELETE_ROLES
  | typeof MANAGE_ROLES
  | typeof VIEW_PERMISSIONS
  | typeof CREATE_PERMISSIONS
  | typeof EDIT_PERMISSIONS
  | typeof DELETE_PERMISSIONS
  | typeof MANAGE_PERMISSIONS
  | typeof VIEW_BIRTH_REGISTRATION
  | typeof CREATE_BIRTH_REGISTRATION
  | typeof EDIT_BIRTH_REGISTRATION
  | typeof DELETE_BIRTH_REGISTRATION
  | typeof VERIFY_BIRTH_REGISTRATION
  | typeof APPROVE_BIRTH_REGISTRATION
  | typeof MANAGE_BIRTH_REGISTRATION
  | typeof VIEW_CID_ISSUANCE
  | typeof CREATE_CID_ISSUANCE
  | typeof EDIT_CID_ISSUANCE
  | typeof DELETE_CID_ISSUANCE
  | typeof VERIFY_CID_ISSUANCE
  | typeof APPROVE_CID_ISSUANCE
  | typeof MANAGE_CID_ISSUANCE
  | typeof VIEW_MOVE_IN_OUT
  | typeof CREATE_MOVE_IN_OUT
  | typeof EDIT_MOVE_IN_OUT
  | typeof DELETE_MOVE_IN_OUT
  | typeof VERIFY_MOVE_IN_OUT
  | typeof APPROVE_MOVE_IN_OUT
  | typeof MANAGE_MOVE_IN_OUT
  | typeof VIEW_RELATIONSHIPS
  | typeof CREATE_RELATIONSHIPS
  | typeof EDIT_RELATIONSHIPS
  | typeof DELETE_RELATIONSHIPS
  | typeof VERIFY_RELATIONSHIPS
  | typeof APPROVE_RELATIONSHIPS
  | typeof MANAGE_RELATIONSHIPS
  | typeof VIEW_NATURALIZATION
  | typeof CREATE_NATURALIZATION
  | typeof EDIT_NATURALIZATION
  | typeof DELETE_NATURALIZATION
  | typeof VERIFY_NATURALIZATION
  | typeof APPROVE_NATURALIZATION
  | typeof MANAGE_NATURALIZATION
  | typeof VIEW_DEATH_REGISTRATION
  | typeof CREATE_DEATH_REGISTRATION
  | typeof EDIT_DEATH_REGISTRATION
  | typeof DELETE_DEATH_REGISTRATION
  | typeof VERIFY_DEATH_REGISTRATION
  | typeof APPROVE_DEATH_REGISTRATION
  | typeof MANAGE_DEATH_REGISTRATION
  | typeof VIEW_COUNTRIES
  | typeof CREATE_COUNTRIES
  | typeof EDIT_COUNTRIES
  | typeof DELETE_COUNTRIES
  | typeof MANAGE_COUNTRIES
  | typeof VIEW_DASHBOARD;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a permission allows a specific action
 */
export function hasPermission(
  userPermissions: string[],
  requiredPermission: Permission
): boolean {
  // Super admin has access to everything
  if (userPermissions.includes(MANAGE_ALL)) {
    return true;
  }

  // Check for specific permission
  return userPermissions.includes(requiredPermission);
}

/**
 * Check if user has any of the required permissions (OR logic)
 */
export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: Permission[]
): boolean {
  // Super admin has access to everything
  if (userPermissions.includes(MANAGE_ALL)) {
    return true;
  }

  // Check if user has any of the required permissions
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
}

/**
 * Check if user has all of the required permissions (AND logic)
 */
export function hasAllPermissions(
  userPermissions: string[],
  requiredPermissions: Permission[]
): boolean {
  // Super admin has access to everything
  if (userPermissions.includes(MANAGE_ALL)) {
    return true;
  }

  // Check if user has all of the required permissions
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
}
