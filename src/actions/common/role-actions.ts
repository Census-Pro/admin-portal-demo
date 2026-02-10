'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

// Use AUTH_SERVICE as the API URL (matches your .env.local configuration)
const API_URL =
  process.env.AUTH_SERVICE || process.env.API_URL || 'http://localhost:5001';

export async function getRoles() {
  try {
    const headers = await instance();

    // Backend requires page and take query parameters
    const url = `${API_URL}/roles?page=1&take=100`;

    console.log('[getRoles] Fetching from:', url);
    console.log('[getRoles] Headers:', {
      ...headers,
      Authorization: headers.Authorization ? 'Bearer ***' : 'Missing'
    });

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    console.log('[getRoles] Response status:', response.status);
    console.log('[getRoles] Response ok:', response.ok);

    if (!response.ok) {
      let errorMessage = 'Failed to fetch roles';
      let errorDetails = null;

      try {
        const contentType = response.headers.get('content-type');
        console.log('[getRoles] Response content-type:', contentType);

        const responseText = await response.text();
        console.log('[getRoles] Response body:', responseText);

        if (responseText) {
          try {
            errorDetails = JSON.parse(responseText);
            errorMessage =
              errorDetails.message || errorDetails.error || errorMessage;
          } catch {
            // Response is not JSON
            errorMessage = responseText || errorMessage;
          }
        }

        console.error('[getRoles] API Error:', {
          status: response.status,
          statusText: response.statusText,
          details: errorDetails,
          body: responseText
        });
      } catch (parseError) {
        console.error('[getRoles] Error parsing response:', parseError);
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to view roles. Please contact your administrator.";
      } else if (response.status === 404) {
        errorMessage =
          'Roles endpoint not found. Please check your backend configuration.';
      } else if (response.status === 500) {
        errorMessage = 'Backend server error. Please check backend logs.';
      }

      return {
        success: false,
        error: errorMessage,
        data: []
      };
    }

    const result = await response.json();
    console.log(
      '[getRoles] Roles fetched successfully:',
      result.data?.length || 0
    );
    console.log('[getRoles] Response structure:', Object.keys(result));

    return {
      success: true,
      data: result.data || []
    };
  } catch (error) {
    console.error('[getRoles] Unexpected error:', error);
    if (error instanceof Error) {
      console.error('[getRoles] Error message:', error.message);
      console.error('[getRoles] Error stack:', error.stack);
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    };
  }
}

export async function getRoleById(id: string) {
  try {
    const headers = await instance();
    const url = `${API_URL}/roles/${id}`;

    console.log('[getRoleById] Fetching role from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch role';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 404) {
        errorMessage = 'Role not found';
      }

      console.error('[getRoleById] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    const result = await response.json();
    console.log('[getRoleById] Role fetched successfully:', result.data?.name);

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    console.error('[getRoleById] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: null
    };
  }
}

export async function createRole(data: { name: string; description: string }) {
  try {
    const headers = await instance();

    console.log('[createRole] Creating role:', data);
    console.log('[createRole] URL:', `${API_URL}/roles`);

    const response = await fetch(`${API_URL}/roles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create role';

      try {
        const error = await response.json();
        console.error('[createRole] API Error:', error);
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        console.error(
          '[createRole] HTTP Error:',
          response.status,
          '[createRole] HTTP Error:',
          response.status,
          response.statusText
        );
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to create roles. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('[createRole] Role created successfully:', result);
    revalidatePath('/dashboard/roles');

    return {
      success: true,
      message: result.message || 'Role created successfully',
      data: result.data
    };
  } catch (error) {
    console.error('[createRole] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function updateRole(data: {
  id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/roles/${data.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update role';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/roles');

    return {
      success: true,
      message: result.message || 'Role updated successfully'
    };
  } catch (error) {
    console.error('Error in updateRole:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function deleteRole(id: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/roles/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete role';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/roles');

    return {
      success: true,
      message: result.message || 'Role deleted successfully'
    };
  } catch (error) {
    console.error('Error in deleteRole:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

// Assign role to admin
export async function assignRoleToAdmin(data: {
  adminId: string;
  roleId: string;
}) {
  try {
    const headers = await instance();

    const url = `${API_URL}/admin-role`;
    console.log('[assignRoleToAdmin] Posting to:', url);
    console.log('[assignRoleToAdmin] Data:', data);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    console.log('[assignRoleToAdmin] Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to assign role to admin';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[assignRoleToAdmin] Error:', errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('[assignRoleToAdmin] Success:', result);

    revalidatePath('/dashboard/user');

    return {
      success: true,
      data: result,
      message: 'Role assigned to admin successfully'
    };
  } catch (error) {
    console.error('[assignRoleToAdmin] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

// Get role permissions
export async function getRolePermissions(roleId: string) {
  try {
    const headers = await instance();
    // Use the get role by ID endpoint which includes permissions
    const url = `${API_URL}/roles/${roleId}`;

    console.log(
      '[getRolePermissions] Fetching role with permissions from:',
      url
    );

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch role permissions';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getRolePermissions] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: []
      };
    }

    const result = await response.json();
    console.log('[getRolePermissions] Role data:', result);

    // Extract permissions from the role object
    const roleData = result.data || result;
    const permissions = roleData.permissions || roleData.rolePermissions || [];

    console.log(
      '[getRolePermissions] Permissions extracted:',
      permissions.length,
      permissions
    );

    return {
      success: true,
      data: permissions
    };
  } catch (error) {
    console.error('[getRolePermissions] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    };
  }
}

// Remove permission from role
export async function removePermissionFromRole(data: {
  roleId: string;
  permissionId: string;
}) {
  try {
    const headers = await instance();
    const url = `${API_URL}/role-permission`;

    console.log('[removePermissionFromRole] Removing permission from role');
    console.log('[removePermissionFromRole] URL:', url);
    console.log('[removePermissionFromRole] Data:', data);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    console.log('[removePermissionFromRole] Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to remove permission from role';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[removePermissionFromRole] Error:', errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('[removePermissionFromRole] Success:', result);

    revalidatePath('/dashboard/roles');
    revalidatePath('/dashboard/permissions');

    return {
      success: true,
      data: result,
      message: 'Permission removed from role successfully'
    };
  } catch (error) {
    console.error('[removePermissionFromRole] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

// Assign permission to role
export async function assignPermissionToRole(data: {
  roleId: string;
  permissionId: string;
}) {
  try {
    const headers = await instance();

    const url = `${API_URL}/role-permission`;

    const requestBody = {
      roleId: data.roleId,
      permissionId: data.permissionId
    };

    const requestHeaders = {
      ...headers,
      'Content-Type': 'application/json'
    };

    console.log('========================================');
    console.log('[assignPermissionToRole] 🔄 Assigning permission to role');
    console.log('[assignPermissionToRole] URL:', url);
    console.log(
      '[assignPermissionToRole] Role ID:',
      data.roleId,
      typeof data.roleId
    );
    console.log(
      '[assignPermissionToRole] Permission ID:',
      data.permissionId,
      typeof data.permissionId
    );
    console.log(
      '[assignPermissionToRole] Request Body:',
      JSON.stringify(requestBody, null, 2)
    );
    console.log('[assignPermissionToRole] Request Headers:', {
      'Content-Type': requestHeaders['Content-Type'],
      Authorization: (requestHeaders as any).Authorization
        ? 'Bearer ***'
        : 'MISSING!'
    });
    console.log('========================================');

    const response = await fetch(url, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody)
    });

    console.log('[assignPermissionToRole] Response status:', response.status);
    console.log('[assignPermissionToRole] Response ok:', response.ok);

    if (!response.ok) {
      let errorMessage = 'Failed to assign permission to role';
      let errorData = null;

      try {
        const responseText = await response.text();
        console.error(
          '[assignPermissionToRole] ❌ Error response text:',
          responseText
        );

        try {
          errorData = JSON.parse(responseText);
          console.error(
            '[assignPermissionToRole] ❌ Error response JSON:',
            errorData
          );
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Response is not JSON
          errorMessage = responseText || errorMessage;
        }
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[assignPermissionToRole] ❌ Final Error:', errorMessage);
      console.error(
        '[assignPermissionToRole] ❌ Status Code:',
        response.status
      );
      console.log('========================================');

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('[assignPermissionToRole] ✅ Success! Response:', result);
    console.log('========================================');

    revalidatePath('/dashboard/roles');
    revalidatePath('/dashboard/permissions');

    return {
      success: true,
      data: result,
      message: 'Permission assigned to role successfully'
    };
  } catch (error) {
    console.error('[assignPermissionToRole] ❌ Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

// Assign permission to admin/user
export async function assignPermissionToAdmin(data: {
  adminId: string;
  permissionId: string;
}) {
  try {
    const headers = await instance();

    const url = `${API_URL}/role-permission`;
    console.log('[assignPermissionToAdmin] Posting to:', url);
    console.log('[assignPermissionToAdmin] Data:', data);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    console.log('[assignPermissionToAdmin] Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to assign permission to admin';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[assignPermissionToAdmin] Error:', errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('[assignPermissionToAdmin] Success:', result);

    revalidatePath('/dashboard/user');

    return {
      success: true,
      data: result,
      message: 'Permission assigned to admin successfully'
    };
  } catch (error) {
    console.error('[assignPermissionToAdmin] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
