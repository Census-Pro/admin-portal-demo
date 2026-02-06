'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

// Use AUTH_SERVICE as the API URL (matches your .env.local configuration)
const API_URL =
  process.env.AUTH_SERVICE || process.env.API_URL || 'http://localhost:5001';

export async function getPermissions(page: number = 1, take: number = 100) {
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
  } catch (error) {
    console.error('🔴 [getPermissions] Unexpected error:', error);
    if (error instanceof Error) {
      console.error('🔴 [getPermissions] Error message:', error.message);
      console.error('🔴 [getPermissions] Error stack:', error.stack);
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    };
  }
}

export async function createPermission(data: {
  name: string;
  description: string;
  actions: string[];
  subjects: string[];
}) {
  try {
    const headers = await instance();

    console.log('🔍 [createPermission] Creating permission:', data);
    console.log('🔍 [createPermission] URL:', `${API_URL}/permissions`);

    const response = await fetch(`${API_URL}/permissions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
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
        error instanceof Error ? error.message : 'An unexpected error occurred'
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
    const response = await fetch(`${API_URL}/permissions/${data.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update permission';

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
      message: result.message || 'Permission updated successfully'
    };
  } catch (error) {
    console.error('🔴 [updatePermission] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
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
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
