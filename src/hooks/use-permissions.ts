'use client';

import { useSession } from 'next-auth/react';
import {
  mapAbilitiesToPermissions,
  hasAnyPermission,
  hasSubjectAccess,
  isSuperAdmin
} from '@/lib/permissions';

interface BackendAbility {
  name: string;
  action: string[];
  subject: string | string[]; // Subject can be a string or array of strings
}

export function usePermissions() {
  const { data: session } = useSession();

  const abilities: BackendAbility[] = (session?.user as any)?.ability || [];
  const roleType = (session?.user as any)?.roleType || '';

  // Convert backend abilities to frontend permission format
  const permissions = mapAbilitiesToPermissions(abilities);

  // Check if user is super admin
  const isSuper = isSuperAdmin(roleType, abilities);

  return {
    abilities,
    permissions,
    roleType,
    isSuperAdmin: isSuper,
    hasPermission: (required: string[]) =>
      hasAnyPermission(permissions, required),
    hasSubject: (subject: string) => hasSubjectAccess(abilities, subject),
    canAccessOrganization: isSuper,
    canAccessRolesAndPermissions: isSuper
  };
}
