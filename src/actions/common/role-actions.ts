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

      if (response.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (response.status === 403) {
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
          response.statusText
        );
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (response.status === 403) {
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
    revalidatePath('/dashboard/master/roles');

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
    revalidatePath('/dashboard/master/roles');

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
    revalidatePath('/dashboard/master/roles');

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
