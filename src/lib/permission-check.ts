/**
 * Permission check utilities for server-side route protection
 *
 * These utilities should be used in page.tsx files to protect routes
 * based on user permissions. This provides actual security (not just UI hiding).
 */

import { Session } from 'next-auth';

export interface PermissionCheck {
  hasAccess: boolean;
  isSuperAdmin: boolean;
  hasManageAll: boolean;
  userPermissions: string[];
}

/**
 * Check if user has access to a specific permission or set of permissions
 *
 * @param session - The NextAuth session object
 * @param requiredPermissions - Single permission or array of permissions (OR logic)
 * @returns Permission check result
 */
export function checkPermission(
  session: Session | null,
  requiredPermissions: string | string[]
): PermissionCheck {
  const userPermissions = (session?.user as any)?.permissions || [];
  const isSuperAdmin = session?.user?.roleType === 'SUPER_ADMIN';
  const hasManageAll = userPermissions.includes('manage:all');

  // Super admin or manage:all grants access to everything
  if (isSuperAdmin || hasManageAll) {
    return {
      hasAccess: true,
      isSuperAdmin,
      hasManageAll,
      userPermissions
    };
  }

  // Check if user has any of the required permissions
  const permissions = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  const hasAccess = permissions.some((permission) =>
    userPermissions.includes(permission)
  );

  return {
    hasAccess,
    isSuperAdmin: false,
    hasManageAll: false,
    userPermissions
  };
}

/**
 * Get first accessible route for a user based on their permissions
 * Used to redirect users without dashboard access to their first available page
 *
 * @param session - The NextAuth session object
 * @returns First accessible route path
 */
export function getFirstAccessibleRoute(session: Session | null): string {
  const userPermissions = (session?.user as any)?.permissions || [];
  const isSuperAdmin = session?.user?.roleType === 'SUPER_ADMIN';

  // Super admin can access dashboard
  if (isSuperAdmin || userPermissions.includes('manage:all')) {
    return '/dashboard/overview';
  }

  // Check dashboard access
  if (userPermissions.includes('read:dashboard')) {
    return '/dashboard/overview';
  }

  // Check user management
  if (
    userPermissions.includes('manage:user') ||
    userPermissions.includes('read:user')
  ) {
    return '/dashboard/user';
  }

  // Check roles & permissions
  if (
    userPermissions.includes('manage:roles') ||
    userPermissions.includes('read:roles')
  ) {
    return '/dashboard/roles';
  }

  if (userPermissions.includes('manage:permissions')) {
    return '/dashboard/permissions';
  }

  // Check birth registration workflow
  if (userPermissions.includes('manage:birth-registration-endorse')) {
    return '/dashboard/birth-registration/endorse';
  }

  if (userPermissions.includes('manage:birth-registration-verify')) {
    return '/dashboard/birth-registration/verify';
  }

  if (userPermissions.includes('manage:birth-registration-approve')) {
    return '/dashboard/birth-registration/approve';
  }

  // Check death registration workflow
  if (userPermissions.includes('manage:death-registration-endorse')) {
    return '/dashboard/death-registration/endorse';
  }

  if (userPermissions.includes('manage:death-registration-verify')) {
    return '/dashboard/death-registration/verify';
  }

  if (userPermissions.includes('manage:death-registration-approve')) {
    return '/dashboard/death-registration/approve';
  }

  // Check master data permissions
  if (
    userPermissions.includes('manage:agencies') ||
    userPermissions.includes('read:agencies')
  ) {
    return '/dashboard/agencies';
  }

  // Default fallback - profile page (always accessible)
  return '/dashboard/profile';
}

/**
 * Check if user has any permissions at all
 * Useful for detecting completely unpermissioned users
 *
 * @param session - The NextAuth session object
 * @returns true if user has at least one permission or is super admin
 */
export function hasAnyPermission(session: Session | null): boolean {
  const userPermissions = (session?.user as any)?.permissions || [];
  const isSuperAdmin = session?.user?.roleType === 'SUPER_ADMIN';

  return isSuperAdmin || userPermissions.length > 0;
}
