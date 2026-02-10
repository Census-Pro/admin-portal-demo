'use server';

import { instance } from '../instance';

const API_URL =
  process.env.AUTH_SERVICE || process.env.API_URL || 'http://localhost:5001';

export async function getAdminById(adminId: string) {
  try {
    const headers = await instance();
    const url = `${API_URL}/admin/${adminId}`;

    console.log('[getAdminById] Fetching admin from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch admin details';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 404) {
        errorMessage = 'User not found';
      }

      console.error('[getAdminById] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    const result = await response.json();
    console.log('[getAdminById] Admin fetched successfully');

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    console.error('[getAdminById] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: null
    };
  }
}

export async function getAdminRoles(adminId: string) {
  try {
    const headers = await instance();
    const url = `${API_URL}/admin-role/admin/${adminId}`;

    console.log('[getAdminRoles] Fetching admin roles from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch admin roles';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getAdminRoles] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: []
      };
    }

    const result = await response.json();

    // The new API returns adminRole objects with role relation
    const roles =
      result
        ?.map((ar: any) => ({
          id: ar.role?.id,
          name: ar.role?.name,
          description: ar.role?.description
        }))
        .filter((role: any) => role.id) || [];

    console.log('[getAdminRoles] Roles fetched successfully:', roles.length);

    return {
      success: true,
      data: roles
    };
  } catch (error) {
    console.error('[getAdminRoles] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    };
  }
}

export async function removeRoleFromAdmin(data: {
  adminId: string;
  roleId: string;
}) {
  try {
    const headers = await instance();
    const url = `${API_URL}/admin-role/admin/${data.adminId}/role/${data.roleId}`;

    console.log('[removeRoleFromAdmin] Deleting from:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Failed to remove role from admin';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[removeRoleFromAdmin] Error:', errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('[removeRoleFromAdmin] Success:', result);

    return {
      success: true,
      message: 'Role removed from admin successfully'
    };
  } catch (error) {
    console.error('[removeRoleFromAdmin] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function updateAdmin(
  adminId: string,
  updateData: {
    cidNo?: string;
    fullName?: string;
    roleType?: string;
    password?: string;
    officeLocationId?: string;
    agencyId?: string;
    mobileNo?: string;
    email?: string;
  }
) {
  try {
    const headers = await instance();
    const url = `${API_URL}/admin/${adminId}`;

    console.log('[updateAdmin] Updating admin at:', url);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update admin';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[updateAdmin] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('[updateAdmin] Admin updated successfully');

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    console.error('[updateAdmin] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
