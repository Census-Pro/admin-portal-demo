'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

// Use AUTH_SERVICE as the API URL (matches your .env.local configuration)
const API_URL =
  process.env.AUTH_SERVICE || process.env.API_URL || 'http://localhost:5001';

export async function getPermissions(page: number = 1, take: number = 100) {
  // DEMO MODE: return mock permissions based on demo users
  return {
    success: true,
    data: [
      {
        id: 'perm-1',
        name: 'manage:all',
        description: 'Full access to all system resources',
        actions: ['manage'],
        subjects: ['all'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-7',
        name: 'manage:birth-registration-verify',
        description: 'Verify birth registration submissions',
        actions: ['manage'],
        subjects: ['birth-registration-verify'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-8',
        name: 'manage:death-registration-verify',
        description: 'Verify death registration submissions',
        actions: ['manage'],
        subjects: ['death-registration-verify'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-9',
        name: 'manage:move-in-out-relieving',
        description: 'Handle move-in/move-out relieving process',
        actions: ['manage'],
        subjects: ['move-in-out-relieving'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-16',
        name: 'manage:birth-registration-endorse',
        description: 'Endorse birth registration applications',
        actions: ['manage'],
        subjects: ['birth-registration-endorse'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-18',
        name: 'manage:death-registration-endorse',
        description: 'Endorse death registration applications',
        actions: ['manage'],
        subjects: ['death-registration-endorse'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-19',
        name: 'manage:move-in-out-receiving-endorse',
        description: 'Endorse move-in/move-out receiving applications',
        actions: ['manage'],
        subjects: ['move-in-out-receiving-endorse'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-20',
        name: 'manage:birth-registration-approve',
        description: 'Approve birth registration applications',
        actions: ['manage'],
        subjects: ['birth-registration-approve'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-21',
        name: 'manage:death-registration-approve',
        description: 'Approve death registration applications',
        actions: ['manage'],
        subjects: ['death-registration-approve'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-22',
        name: 'manage:move-in-out-receiving-approve',
        description: 'Approve move-in/move-out receiving applications',
        actions: ['manage'],
        subjects: ['move-in-out-receiving-approve'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-hoh',
        name: 'manage:hoh-change-approve',
        description: 'Approve Head of Household change requests',
        actions: ['manage'],
        subjects: ['hoh-change-approve'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-23',
        name: 'manage:cid-issuance-fresh-assessment',
        description: 'Assess fresh CID issuance applications',
        actions: ['manage'],
        subjects: ['cid-issuance-fresh-assessment'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-24',
        name: 'manage:cid-issuance-fresh-payment',
        description: 'Process payment for fresh CID issuance',
        actions: ['manage'],
        subjects: ['cid-issuance-fresh-payment'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-25',
        name: 'manage:cid-issuance-fresh-approval',
        description: 'Approve fresh CID issuance applications',
        actions: ['manage'],
        subjects: ['cid-issuance-fresh-approval'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-26',
        name: 'manage:cid-issuance-renewal-assessment',
        description: 'Assess CID renewal applications',
        actions: ['manage'],
        subjects: ['cid-issuance-renewal-assessment'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-27',
        name: 'manage:cid-issuance-renewal-payment',
        description: 'Process payment for CID renewal',
        actions: ['manage'],
        subjects: ['cid-issuance-renewal-payment'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-28',
        name: 'manage:cid-issuance-renewal-approval',
        description: 'Approve CID renewal applications',
        actions: ['manage'],
        subjects: ['cid-issuance-renewal-approval'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-29',
        name: 'manage:cid-issuance-replacement-assessment',
        description: 'Assess CID replacement applications',
        actions: ['manage'],
        subjects: ['cid-issuance-replacement-assessment'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-30',
        name: 'manage:cid-issuance-replacement-payment',
        description: 'Process payment for CID replacement',
        actions: ['manage'],
        subjects: ['cid-issuance-replacement-payment'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-31',
        name: 'manage:cid-issuance-replacement-approval',
        description: 'Approve CID replacement applications',
        actions: ['manage'],
        subjects: ['cid-issuance-replacement-approval'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-32',
        name: 'manage:nationality-certificate-assessment',
        description: 'Assess nationality certificate applications',
        actions: ['manage'],
        subjects: ['nationality-certificate-assessment'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-33',
        name: 'manage:nationality-certificate-payment',
        description: 'Process payment for nationality certificates',
        actions: ['manage'],
        subjects: ['nationality-certificate-payment'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-34',
        name: 'manage:nationality-certificate-approval',
        description: 'Approve nationality certificate applications',
        actions: ['manage'],
        subjects: ['nationality-certificate-approval'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-35',
        name: 'manage:relation-certificate-assessment',
        description: 'Assess relation certificate applications',
        actions: ['manage'],
        subjects: ['relation-certificate-assessment'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-36',
        name: 'manage:relation-certificate-payment',
        description: 'Process payment for relation certificates',
        actions: ['manage'],
        subjects: ['relation-certificate-payment'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'perm-37',
        name: 'manage:relation-certificate-approval',
        description: 'Approve relation certificate applications',
        actions: ['manage'],
        subjects: ['relation-certificate-approval'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  };

  try {
    const headers = await instance();

    // Backend requires page and take query parameters
    const url = `${API_URL}/permissions?page=${page}&take=${take}`;

    console.log('🔍 [getPermissions] Fetching from:', url);
    console.log('🔍 [getPermissions] Headers:', {
      ...headers,
      Authorization: headers.Authorization ? 'Bearer ***' : 'Missing'
    });

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    console.log('🔍 [getPermissions] Response status:', response.status);
    console.log('🔍 [getPermissions] Response ok:', response.ok);

    if (!response.ok) {
      let errorMessage = 'Failed to fetch permissions';
      let errorDetails = null;

      try {
        const contentType = response.headers.get('content-type');
        console.log('🔍 [getPermissions] Response content-type:', contentType);

        const responseText = await response.text();
        console.log('🔍 [getPermissions] Response body:', responseText);

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

        console.error('🔴 [getPermissions] API Error:', {
          status: response.status,
          statusText: response.statusText,
          details: errorDetails,
          body: responseText
        });
      } catch (parseError) {
        console.error(
          '🔴 [getPermissions] Error parsing response:',
          parseError
        );
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to view permissions. Please contact your administrator.";
      } else if (response.status === 404) {
        errorMessage =
          'Permissions endpoint not found. Please check your backend configuration.';
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
      '✅ [getPermissions] Permissions fetched successfully:',
      result.data?.length || 0
    );
    console.log('✅ [getPermissions] Response structure:', Object.keys(result));

    return {
      success: true,
      data: result.data || []
    };
  } catch (error: unknown) {
    console.error('🔴 [getPermissions] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? (error as Error).message
          : 'An unexpected error occurred',
      data: []
    };
  }
}

export async function createPermission(data: {
  name: string;
  description?: string;
  actions: string[];
  subjects: string[];
}) {
  try {
    const headers = await instance();

    console.log('🔍 [createPermission] Creating permission:', data);
    console.log('🔍 [createPermission] URL:', `${API_URL}/permissions`);

    // Convert arrays to comma-separated strings for backend
    const payload = {
      ...data,
      actions: Array.isArray(data.actions)
        ? data.actions.join(',')
        : data.actions,
      subjects: Array.isArray(data.subjects)
        ? data.subjects.join(',')
        : data.subjects
    };

    console.log('🔍 [createPermission] Sending payload:', payload);

    const response = await fetch(`${API_URL}/permissions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create permission';

      try {
        const error = await response.json();
        console.error('🔴 [createPermission] API Error:', error);
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        console.error(
          '🔴 [createPermission] HTTP Error:',
          response.status,
          response.statusText
        );
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to create permissions. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('[createPermission] Permission created successfully:', result);
    revalidatePath('/dashboard/permissions');

    return {
      success: true,
      message: result.message || 'Permission created successfully',
      data: result.data
    };
  } catch (error) {
    console.error('🔴 [createPermission] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? (error as Error).message
          : 'An unexpected error occurred'
    };
  }
}

export async function updatePermission(data: {
  id: string;
  name?: string;
  description?: string;
  actions?: string[];
  subjects?: string[];
  isActive?: boolean;
}) {
  try {
    const headers = await instance();

    // Remove id from the body data
    const { id, ...updateData } = data;

    // Convert arrays to comma-separated strings for backend
    const payload = {
      ...updateData,
      ...(updateData.actions && Array.isArray(updateData.actions)
        ? { actions: updateData.actions.join(',') }
        : {}),
      ...(updateData.subjects && Array.isArray(updateData.subjects)
        ? { subjects: updateData.subjects.join(',') }
        : {})
    };

    console.log('🔍 [updatePermission] Updating permission:', id, payload);
    console.log('🔍 [updatePermission] URL:', `${API_URL}/permissions/${id}`);

    const response = await fetch(`${API_URL}/permissions/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update permission';

      try {
        const error = await response.json();
        console.error('🔴 [updatePermission] API Error:', error);
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        console.error(
          '🔴 [updatePermission] HTTP Error:',
          response.status,
          response.statusText
        );
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to update permissions. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log(
      '✅ [updatePermission] Permission updated successfully:',
      result
    );
    revalidatePath('/dashboard/permissions');

    return {
      success: true,
      message: result.message || 'Permission updated successfully',
      data: result.data
    };
  } catch (error) {
    console.error('🔴 [updatePermission] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? (error as Error).message
          : 'An unexpected error occurred'
    };
  }
}

export async function deletePermission(id: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/permissions/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete permission';

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
    revalidatePath('/dashboard/permissions');

    return {
      success: true,
      message: result.message || 'Permission deleted successfully'
    };
  } catch (error) {
    console.error('🔴 [deletePermission] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? (error as Error).message
          : 'An unexpected error occurred'
    };
  }
}
