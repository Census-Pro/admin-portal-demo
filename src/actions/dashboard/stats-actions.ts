'use server';

import { instance } from '../instance';

const API_URL = process.env.API_URL || 'http://localhost:5001';

/**
 * Get dashboard statistics from the auth_service
 * Fetches total users, roles, and permissions counts
 */
export async function getDashboardStats() {
  try {
    const headers = await instance();

    // Fetch all data in parallel
    const [usersResponse, rolesResponse, permissionsResponse] =
      await Promise.all([
        fetch(`${API_URL}/users/all`, {
          method: 'GET',
          headers,
          cache: 'no-store'
        }),
        fetch(`${API_URL}/roles/all`, {
          method: 'GET',
          headers,
          cache: 'no-store'
        }),
        fetch(`${API_URL}/permissions/all`, {
          method: 'GET',
          headers,
          cache: 'no-store'
        })
      ]);

    // Parse responses
    const usersData = usersResponse.ok ? await usersResponse.json() : null;
    const rolesData = rolesResponse.ok ? await rolesResponse.json() : null;
    const permissionsData = permissionsResponse.ok
      ? await permissionsResponse.json()
      : null;

    // Calculate statistics
    const totalUsers = usersData?.length || 0;
    const totalRoles = rolesData?.length || 0;
    const totalPermissions = permissionsData?.length || 0;

    // Calculate active/pending roles (roles with isActive field)
    const activeRoles =
      rolesData?.filter((role: any) => role.isActive !== false).length || 0;
    const pendingRoles = totalRoles - activeRoles;

    return {
      success: true,
      data: {
        totalUsers,
        totalRoles,
        activeRoles,
        pendingRoles,
        totalPermissions
      }
    };
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: {
        totalUsers: 0,
        totalRoles: 0,
        activeRoles: 0,
        pendingRoles: 0,
        totalPermissions: 0
      }
    };
  }
}

export interface ServiceStats {
  name: string;
  shortName: string;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  href: string;
}
