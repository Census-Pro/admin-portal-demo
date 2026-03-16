'use client';

/**
 * Fully client-side hook for filtering navigation items based on RBAC
 *
 * This hook uses NextAuth's useSession hook to check permissions, roles, and organization
 * without any server calls. This is perfect for navigation visibility (UX only).
 *
 * Performance:
 * - All checks are synchronous (no server calls)
 * - Instant filtering
 * - No loading states
 * - No UI flashing
 *
 * Note: For actual security (API routes, server actions), always use server-side checks.
 * This is only for UI visibility.
 */

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import type { NavItem } from '@/types';

/**
 * Hook to filter navigation items based on RBAC (fully client-side)
 *
 * @param items - Array of navigation items to filter
 * @returns Filtered items
 */
export function useFilteredNavItems(items: NavItem[]) {
  const { data: session, status } = useSession();
  const user = session?.user;

  // Helper function to check if user has a specific ability
  const hasAbility = useMemo(() => {
    // SUPER_ADMIN bypass - they have access to everything
    if (user?.roleType === 'SUPER_ADMIN') {
      return () => {
        console.log(
          'SUPER_ADMIN roleType detected - bypassing permission check, granting access'
        );
        return true;
      };
    }

    // Use transformed permissions array (action:subject format)
    const permissions = (user as any)?.permissions || [];

    if (permissions.length === 0) {
      console.log('No permissions found for user');
      return () => false;
    }

    console.log('User permissions:', permissions);

    return (permission: string) => {
      // Check for 'manage:all' - grants access to everything
      const hasManageAll = permissions.includes('manage:all');

      if (hasManageAll) {
        console.log(
          `User has 'manage:all' - granting access to "${permission}"`
        );
        return true;
      }

      const result = permissions.includes(permission);

      console.log(`Checking permission "${permission}":`, {
        result,
        hasManageAll,
        userPermissions: permissions
      });

      return result;
    };
  }, [user]);

  // Helper function to check if user has a specific role
  const hasRole = useMemo(() => {
    // SUPER_ADMIN bypass - they have all roles
    if (user?.roleType === 'SUPER_ADMIN') {
      return () => {
        console.log(
          'SUPER_ADMIN roleType detected - bypassing role check, granting access'
        );
        return true;
      };
    }

    if (!user?.roles) {
      console.log('No roles found for user');
      return () => false;
    }

    return (roleName: string) => {
      const result = user.roles.some((role) => role.name === roleName);
      console.log(`Checking role "${roleName}":`, {
        result,
        userRoles: user.roles.map((r) => r.name)
      });
      return result;
    };
  }, [user?.roles, user?.roleType]);

  // Helper function to check if an item passes all access checks
  const checkItemAccess = useMemo(() => {
    return (access: any) => {
      if (!access) {
        console.log('No access restrictions, allowing access');
        return true;
      }

      console.log('Checking access:', access);

      // Check single permission
      if (access.permission && !hasAbility(access.permission)) {
        console.log(`Access denied: Missing permission "${access.permission}"`);
        return false;
      }

      // Check multiple permissions (OR logic - user needs ANY of these)
      if (access.permissions && access.permissions.length > 0) {
        const hasAnyPermission = access.permissions.some((permission: string) =>
          hasAbility(permission)
        );
        if (!hasAnyPermission) {
          console.log(
            `Access denied: Missing any of permissions [${access.permissions.join(', ')}]`
          );
          return false;
        }
      }

      // Check single role
      if (access.role && !hasRole(access.role)) {
        console.log(`Access denied: Missing role "${access.role}"`);
        return false;
      }

      // Check multiple roles (OR logic - user needs ANY of these)
      if (access.roles && access.roles.length > 0) {
        const hasAnyRole = access.roles.some((role: string) => hasRole(role));
        if (!hasAnyRole) {
          console.log(
            `Access denied: Missing any of roles [${access.roles.join(', ')}]`
          );
          return false;
        }
      }

      console.log('Access granted');
      return true;
    };
  }, [hasAbility, hasRole]);

  // Filter items synchronously (all client-side)
  const filteredItems = useMemo(() => {
    // Return empty array if session is loading or no session
    if (status === 'loading' || !session) {
      console.log('Navigation Filter Debug: Session loading or no session', {
        status,
        hasSession: !!session
      });
      return [];
    }

    console.log('Navigation Filter Debug: Processing items', {
      user: session?.user,
      abilities: user?.ability,
      roles: user?.roles,
      roleType: user?.roleType,
      totalItems: items.length
    });

    // Helper to check subject access from backend abilities
    const hasSubjectAccess = (subject: string) => {
      if (!user?.ability) {
        console.log(`hasSubjectAccess("${subject}"): No abilities found`);
        return false;
      }

      // Normalize subject for comparison (e.g., "Birth Registration" -> "birth registration")
      const normalizedSubject = subject.toLowerCase();

      console.log(`hasSubjectAccess: Checking subject "${subject}"`, {
        normalizedSubject,
        abilities: user.ability
      });

      const result = user.ability.some((ability: any) => {
        // Handle subject as either string or array
        const subjects = Array.isArray(ability.subject)
          ? ability.subject
          : [ability.subject || ''];

        // Check if any of the ability subjects match the requested subject
        const matches = subjects.some((abilitySubject: string) => {
          const normalizedAbilitySubject = abilitySubject.toLowerCase();
          console.log(
            `- Comparing "${normalizedAbilitySubject}" with "${normalizedSubject}"`
          );
          return normalizedAbilitySubject === normalizedSubject;
        });

        return matches;
      });

      console.log(`hasSubjectAccess("${subject}"): ${result}`);
      return result;
    };

    const filtered = items
      .map((item) => {
        // Track whether this item was originally a parent (had non-empty children)
        const wasParent = Array.isArray(item.items) && item.items.length > 0;

        // First, filter child items if they exist
        let filteredChildren: NavItem[] = [];
        if (item.items && item.items.length > 0) {
          // Helper: same subject-first logic used for top-level leaf items
          const checkChildAccess = (childItem: NavItem): boolean => {
            if (childItem.subject) {
              const subjectAccess = hasSubjectAccess(childItem.subject);
              if (subjectAccess) return true;
              // Subject check failed — fall back to explicit permission check
            }
            return checkItemAccess(childItem.access);
          };

          // Determine accessible non-header children first
          const accessibleNonHeaderChildren = item.items.filter((childItem) => {
            if (childItem.isHeader) return false;
            return checkChildAccess(childItem);
          });

          // Only keep children (including headers) if there are accessible non-header children
          if (accessibleNonHeaderChildren.length > 0) {
            // Pre-compute which non-header children are accessible
            const accessibleTitles = new Set(
              accessibleNonHeaderChildren.map((c) => c.title)
            );

            filteredChildren = item.items.filter((childItem, idx, arr) => {
              if (childItem.isHeader) {
                // Only keep header if there's at least one accessible non-header item
                // between this header and the next header
                const nextHeaderIdx = arr.findIndex(
                  (c, i) => i > idx && c.isHeader
                );
                const end = nextHeaderIdx === -1 ? arr.length : nextHeaderIdx;
                const hasAccessibleFollower = arr
                  .slice(idx + 1, end)
                  .some((c) => !c.isHeader && accessibleTitles.has(c.title));
                return hasAccessibleFollower;
              }
              const childHasAccess = checkChildAccess(childItem);
              console.log(`Child "${childItem.title}" of "${item.title}":`, {
                access: childItem.access,
                subject: childItem.subject,
                hasAccess: childHasAccess
              });
              return childHasAccess;
            });
          }
        }

        return {
          ...item,
          items: filteredChildren,
          _wasParent: wasParent
        };
      })
      .filter((item) => {
        const wasParent = (item as any)._wasParent;

        // Check if item is super admin only
        if (item.superAdminOnly && user?.roleType !== 'SUPER_ADMIN') {
          console.log(`Item "${item.title}": Restricted to SUPER_ADMIN only`);
          return false;
        }

        // SUPER_ADMIN bypass — sees everything (that isn't already filtered above)
        if (user?.roleType === 'SUPER_ADMIN') {
          console.log(`Item "${item.title}": SUPER_ADMIN has access`);
          return true;
        }

        // For parent items (originally had children): show only if there are accessible non-header children
        if (wasParent) {
          // item.items here is already the filtered children array
          const hasAccessibleChildren = item.items
            ? item.items.some((child) => !child.isHeader)
            : false;
          console.log(
            `Parent "${item.title}": Has ${item.items?.length ?? 0} accessible children (has non-header: ${hasAccessibleChildren})`
          );
          return hasAccessibleChildren;
        }

        // Leaf item: check subject-based access first, then fall back to permission check
        if (item.subject) {
          const subjectAccess = hasSubjectAccess(item.subject);
          console.log(
            `Item "${item.title}": Subject "${item.subject}" access = ${subjectAccess}`
          );

          if (subjectAccess) {
            return true;
          }

          // Subject check failed — fall back to explicit permission check
          console.log(
            `Item "${item.title}": No subject access, falling back to permission check`
          );
        }

        const hasAccess = checkItemAccess(item.access);
        console.log(`Item "${item.title}":`, {
          access: item.access,
          hasAccess,
          abilities: user?.ability,
          roles: user?.roles,
          roleType: user?.roleType
        });
        return hasAccess;
      })
      .map((item) => {
        // Clean up the internal _wasParent flag before returning
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _wasParent: _removed, ...cleanItem } = item as any;
        return cleanItem as NavItem;
      });

    console.log('Navigation Filter Debug: Final filtered items', {
      filteredCount: filtered.length,
      filteredItems: filtered.map((item) => ({
        title: item.title,
        hasChildren: !!item.items?.length,
        childrenCount: item.items?.length || 0
      }))
    });

    return filtered;
  }, [items, checkItemAccess, session, status, user]);

  return filteredItems;
}

/**
 * Hook to check user abilities/permissions
 */
export function useUserAbilities() {
  const { data: session } = useSession();
  const user = session?.user;

  return useMemo(() => {
    // SUPER_ADMIN bypass - they have all abilities
    if (user?.roleType === 'SUPER_ADMIN') {
      return {
        hasAbility: () => true,
        hasAnyAbility: () => true,
        hasAllAbilities: () => true,
        abilities: ['manage:all']
      };
    }

    // Use transformed permissions from auth.config.ts
    const permissions = (user as any)?.permissions || [];

    if (permissions.length === 0) {
      return {
        hasAbility: () => false,
        hasAnyAbility: () => false,
        hasAllAbilities: () => false,
        abilities: []
      };
    }

    // Check if user has 'manage:all' permission
    const hasManageAll = permissions.includes('manage:all');

    return {
      hasAbility: (permission: string) =>
        hasManageAll || permissions.includes(permission),
      hasAnyAbility: (permissionList: string[]) =>
        hasManageAll || permissionList.some((p) => permissions.includes(p)),
      hasAllAbilities: (permissionList: string[]) =>
        hasManageAll || permissionList.every((p) => permissions.includes(p)),
      abilities: permissions
    };
  }, [user]);
}

/**
 * Hook to check user roles
 */
export function useUserRoles() {
  const { data: session } = useSession();
  const user = session?.user;

  return useMemo(() => {
    // SUPER_ADMIN bypass - they have all roles
    if (user?.roleType === 'SUPER_ADMIN') {
      return {
        hasRole: () => true,
        hasAnyRole: () => true,
        hasAllRoles: () => true,
        roles: [],
        roleNames: ['SUPER_ADMIN']
      };
    }

    if (!user?.roles) {
      return {
        hasRole: () => false,
        hasAnyRole: () => false,
        hasAllRoles: () => false,
        roles: [],
        roleNames: []
      };
    }

    const roleNames = user.roles.map((role) => role.name);

    return {
      hasRole: (roleName: string) => roleNames.includes(roleName),
      hasAnyRole: (roles: string[]) => roles.some((r) => roleNames.includes(r)),
      hasAllRoles: (roles: string[]) =>
        roles.every((r) => roleNames.includes(r)),
      roles: user.roles,
      roleNames
    };
  }, [user?.roles, user?.roleType]);
}
