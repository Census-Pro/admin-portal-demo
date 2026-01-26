/**
 * Utility to map backend ability format to frontend permissions
 * and check if user has access to specific features
 */

interface BackendAbility {
  name: string;
  action: string[];
  subject: string;
}

/**
 * Maps backend ability to frontend permission strings
 * Backend format: { action: ["create", "read"], subject: "Birth Registration" }
 * Frontend format: ["create:birth-registration", "read:birth-registration"]
 */
export function mapAbilitiesToPermissions(
  abilities: BackendAbility[]
): string[] {
  const permissions: string[] = [];

  abilities.forEach((ability) => {
    const subject = normalizeSubject(ability.subject);
    ability.action.forEach((action) => {
      const normalizedAction = action.toLowerCase();
      permissions.push(`${normalizedAction}:${subject}`);
    });
  });

  return permissions;
}

/**
 * Normalizes subject name from backend to frontend format
 * "Birth Registration" -> "birth-registration"
 * "Admin" -> "admin"
 * "CID Issuance" -> "cid-issuance"
 */
function normalizeSubject(subject: string): string {
  return subject
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

/**
 * Checks if user has any of the required permissions
 */
export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  // If user has manage:all, they have access to everything
  if (userPermissions.includes('manage:all')) {
    return true;
  }

  // Check if user has at least one of the required permissions
  return requiredPermissions.some((required) =>
    userPermissions.includes(required)
  );
}

/**
 * Checks if user has specific subject access
 * Used for filtering navigation based on backend abilities
 */
export function hasSubjectAccess(
  abilities: BackendAbility[],
  subject: string
): boolean {
  const normalizedSubject = normalizeSubject(subject);

  return abilities.some(
    (ability) => normalizeSubject(ability.subject) === normalizedSubject
  );
}

/**
 * Checks if user is Super Admin (has manage:all or roleType SUPER_ADMIN)
 */
export function isSuperAdmin(
  roleType: string,
  abilities: BackendAbility[]
): boolean {
  if (roleType === 'SUPER_ADMIN') {
    return true;
  }

  const permissions = mapAbilitiesToPermissions(abilities);
  return permissions.includes('manage:all');
}

/**
 * Subject mapping for navigation filtering
 */
export const SUBJECT_MAP = {
  DASHBOARD: 'Dashboard',
  USER: 'Admin',
  BIRTH_REGISTRATION: 'Birth Registration',
  CID_ISSUANCE: 'CID Issuance',
  MOVE_IN_OUT: 'Move In/Move Out',
  RELATIONSHIPS: 'Relationships',
  NATURALIZATION: 'Naturalization',
  DEATH_REGISTRATION: 'Death Registration'
} as const;
