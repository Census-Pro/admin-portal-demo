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

  // Helper function to check if user has a specific ability/permission
  const hasAbility = useMemo(() => {
    if (user?.roleType === 'SUPER_ADMIN') {
      return () => true;
    }

    const permissions = (user as any)?.permissions || [];

    if (permissions.length === 0) {
      return () => false;
    }

    return (permission: string) => {
      const hasManageAll = permissions.includes('manage:all');
      if (hasManageAll) return true;
      return permissions.includes(permission);
    };
  }, [user]);

  // Helper function to check if user has a specific role
  const hasRole = useMemo(() => {
    if (user?.roleType === 'SUPER_ADMIN') {
      return () => true;
    }

    if (!user?.roles) {
      return () => false;
    }

    return (roleName: string) => {
      return user.roles.some((role) => role.name === roleName);
    };
  }, [user?.roles, user?.roleType]);

  // Helper function to check if an item passes all access checks
  const checkItemAccess = useMemo(() => {
    return (access: any) => {
      if (!access) return true;

      // Check single permission
      if (access.permission && !hasAbility(access.permission)) {
        return false;
      }

      // Check multiple permissions (OR logic - user needs ANY of these)
      if (access.permissions && access.permissions.length > 0) {
        const hasAnyPermission = access.permissions.some((permission: string) =>
          hasAbility(permission)
        );
        if (!hasAnyPermission) return false;
      }

      // Check single role
      if (access.role && !hasRole(access.role)) {
        return false;
      }

      // Check multiple roles (OR logic - user needs ANY of these)
      if (access.roles && access.roles.length > 0) {
        const hasAnyRole = access.roles.some((role: string) => hasRole(role));
        if (!hasAnyRole) return false;
      }

      return true;
    };
  }, [hasAbility, hasRole]);

  // Filter items synchronously (all client-side)
  const filteredItems = useMemo(() => {
    if (status === 'loading') {
      return [];
    }

    // Helper to check subject access from backend abilities
    const hasSubjectAccess = (subject: string): boolean => {
      if (!user?.ability) return false;

      const normalizedSubject = subject.toLowerCase();

      return user.ability.some((ability: any) => {
        const subjects = Array.isArray(ability.subject)
          ? ability.subject
          : [ability.subject || ''];

        return subjects.some((abilitySubject: string) => {
          return abilitySubject.toLowerCase() === normalizedSubject;
        });
      });
    };

    const filtered = items
      .map((item) => {
        const wasParent = Array.isArray(item.items) && item.items.length > 0;

        // First, filter child items if they exist
        let filteredChildren: NavItem[] = [];
        if (item.items && item.items.length > 0) {
          // Helper: subject-first logic for child items
          const checkChildAccess = (childItem: NavItem): boolean => {
            // If no session, only show items with empty permissions (public items)
            if (!session) {
              return (
                !childItem.access?.permissions ||
                childItem.access.permissions.length === 0
              );
            }

            if (childItem.subject) {
              const subjectAccess = hasSubjectAccess(childItem.subject);
              if (subjectAccess) return true;
              // Subject check failed - fall back to explicit permission check
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
                return arr
                  .slice(idx + 1, end)
                  .some((c) => !c.isHeader && accessibleTitles.has(c.title));
              }
              return checkChildAccess(childItem);
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
          return false;
        }

        // SUPER_ADMIN bypass - sees everything
        if (user?.roleType === 'SUPER_ADMIN') {
          return true;
        }

        // If no session, only show items with empty permissions (public items)
        if (!session) {
          return (
            !item.access?.permissions || item.access.permissions.length === 0
          );
        }

        // For parent items (originally had children): show only if there are accessible non-header children
        if (wasParent) {
          const hasAccessibleChildren = item.items
            ? item.items.some((child) => !child.isHeader)
            : false;
          return hasAccessibleChildren;
        }

        // Leaf item: check subject-based access first, then fall back to permission check
        if (item.subject) {
          const subjectAccess = hasSubjectAccess(item.subject);
          if (subjectAccess) return true;
          // Subject check failed - fall back to explicit permission check
        }

        return checkItemAccess(item.access);
      })
      .map((item) => {
        // Clean up the internal _wasParent flag before returning
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _wasParent: _removed, ...cleanItem } = item as any;
        return cleanItem as NavItem;
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
    if (user?.roleType === 'SUPER_ADMIN') {
      return {
        hasAbility: () => true,
        hasAnyAbility: () => true,
        hasAllAbilities: () => true,
        abilities: ['manage:all']
      };
    }

    const permissions = (user as any)?.permissions || [];

    if (permissions.length === 0) {
      return {
        hasAbility: () => false,
        hasAnyAbility: () => false,
        hasAllAbilities: () => false,
        abilities: []
      };
    }

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
