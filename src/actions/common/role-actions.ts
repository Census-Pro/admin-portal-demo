'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

// Use AUTH_SERVICE as the API URL (matches your .env.local configuration)
const API_URL =
  process.env.AUTH_SERVICE || process.env.API_URL || 'http://localhost:5001';

export async function getRoles() {
  // DEMO MODE: return mock roles based on demo users
  return {
    success: true,
    data: [
      {
        id: 'role-1',
        name: 'Super Admin',
        description:
          'Full system access with all CRUD operations across all modules.',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'role-5',
        name: 'Tsogpa',
        description:
          'Handles birth and death registration verification and move-in/move-out relieving.',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'role-8',
        name: 'Gup',
        description:
          'Endorses birth and death registrations and move-in/move-out receiving.',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'role-9',
        name: 'Headquarters',
        description:
          'Approves registrations, HOH changes, CID issuance, and certificate applications.',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  };

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
  // DEMO MODE: return mock role data
  const MOCK_ROLES: Record<string, any> = {
    'role-1': {
      id: 'role-1',
      name: 'Super Admin',
      description:
        'Full system access with all CRUD operations across all modules.',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: [
        {
          id: 'perm-1',
          name: 'manage:all',
          actions: ['manage'],
          subjects: ['all']
        }
      ]
    },
    'role-5': {
      id: 'role-5',
      name: 'Tsogpa',
      description:
        'Handles birth and death registration verification and move-in/move-out relieving.',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: [
        {
          id: 'perm-7',
          name: 'manage:birth-registration-verify',
          actions: ['manage'],
          subjects: ['birth-registration-verify']
        },
        {
          id: 'perm-8',
          name: 'manage:death-registration-verify',
          actions: ['manage'],
          subjects: ['death-registration-verify']
        },
        {
          id: 'perm-9',
          name: 'manage:move-in-out-relieving',
          actions: ['manage'],
          subjects: ['move-in-out-relieving']
        }
      ]
    },
    'role-8': {
      id: 'role-8',
      name: 'Gup',
      description:
        'Endorses birth and death registrations and move-in/move-out receiving.',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: [
        {
          id: 'perm-16',
          name: 'manage:birth-registration-endorse',
          actions: ['manage'],
          subjects: ['birth-registration-endorse']
        },
        {
          id: 'perm-18',
          name: 'manage:death-registration-endorse',
          actions: ['manage'],
          subjects: ['death-registration-endorse']
        },
        {
          id: 'perm-19',
          name: 'manage:move-in-out-receiving-endorse',
          actions: ['manage'],
          subjects: ['move-in-out-receiving-endorse']
        }
      ]
    },
    'role-9': {
      id: 'role-9',
      name: 'Headquarters',
      description:
        'Approves registrations, HOH changes, CID issuance, and certificate applications.',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: [
        {
          id: 'perm-20',
          name: 'manage:birth-registration-approve',
          actions: ['manage'],
          subjects: ['birth-registration-approve']
        },
        {
          id: 'perm-21',
          name: 'manage:death-registration-approve',
          actions: ['manage'],
          subjects: ['death-registration-approve']
        },
        {
          id: 'perm-22',
          name: 'manage:move-in-out-receiving-approve',
          actions: ['manage'],
          subjects: ['move-in-out-receiving-approve']
        },
        {
          id: 'perm-hoh',
          name: 'manage:hoh-change-approve',
          actions: ['manage'],
          subjects: ['hoh-change-approve']
        },
        {
          id: 'perm-23',
          name: 'manage:cid-issuance-fresh-assessment',
          actions: ['manage'],
          subjects: ['cid-issuance-fresh-assessment']
        },
        {
          id: 'perm-24',
          name: 'manage:cid-issuance-fresh-payment',
          actions: ['manage'],
          subjects: ['cid-issuance-fresh-payment']
        },
        {
          id: 'perm-25',
          name: 'manage:cid-issuance-fresh-approval',
          actions: ['manage'],
          subjects: ['cid-issuance-fresh-approval']
        },
        {
          id: 'perm-26',
          name: 'manage:cid-issuance-renewal-assessment',
          actions: ['manage'],
          subjects: ['cid-issuance-renewal-assessment']
        },
        {
          id: 'perm-27',
          name: 'manage:cid-issuance-renewal-payment',
          actions: ['manage'],
          subjects: ['cid-issuance-renewal-payment']
        },
        {
          id: 'perm-28',
          name: 'manage:cid-issuance-renewal-approval',
          actions: ['manage'],
          subjects: ['cid-issuance-renewal-approval']
        },
        {
          id: 'perm-29',
          name: 'manage:cid-issuance-replacement-assessment',
          actions: ['manage'],
          subjects: ['cid-issuance-replacement-assessment']
        },
        {
          id: 'perm-30',
          name: 'manage:cid-issuance-replacement-payment',
          actions: ['manage'],
          subjects: ['cid-issuance-replacement-payment']
        },
        {
          id: 'perm-31',
          name: 'manage:cid-issuance-replacement-approval',
          actions: ['manage'],
          subjects: ['cid-issuance-replacement-approval']
        },
        {
          id: 'perm-32',
          name: 'manage:nationality-certificate-assessment',
          actions: ['manage'],
          subjects: ['nationality-certificate-assessment']
        },
        {
          id: 'perm-33',
          name: 'manage:nationality-certificate-payment',
          actions: ['manage'],
          subjects: ['nationality-certificate-payment']
        },
        {
          id: 'perm-34',
          name: 'manage:nationality-certificate-approval',
          actions: ['manage'],
          subjects: ['nationality-certificate-approval']
        },
        {
          id: 'perm-35',
          name: 'manage:relation-certificate-assessment',
          actions: ['manage'],
          subjects: ['relation-certificate-assessment']
        },
        {
          id: 'perm-36',
          name: 'manage:relation-certificate-payment',
          actions: ['manage'],
          subjects: ['relation-certificate-payment']
        },
        {
          id: 'perm-37',
          name: 'manage:relation-certificate-approval',
          actions: ['manage'],
          subjects: ['relation-certificate-approval']
        }
      ]
    }
  };

  if (MOCK_ROLES[id]) {
    return { success: true, data: MOCK_ROLES[id] };
  }

  return { success: false, error: 'Role not found', data: null };

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
    const { id, ...updateData } = data;

    console.log('[updateRole] Updating role:', id, updateData);
    console.log('[updateRole] URL:', `${API_URL}/roles/${id}`);

    const response = await fetch(`${API_URL}/roles/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update role';

      try {
        const error = await response.json();
        console.error('[updateRole] API Error:', error);
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        console.error(
          '[updateRole] HTTP Error:',
          response.status,
          response.statusText
        );
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to update roles. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('[updateRole] Role updated successfully:', result);
    revalidatePath('/dashboard/roles');

    return {
      success: true,
      message: result.message || 'Role updated successfully',
      data: result.data
    };
  } catch (error) {
    console.error('[updateRole] Unexpected error:', error);
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
