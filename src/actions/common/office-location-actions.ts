'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL =
  process.env.AUTH_SERVICE || process.env.API_URL || 'http://localhost:5001';

export async function getOfficeLocations(
  page: number = 1,
  take: number = 10,
  search?: string
) {
  try {
    const headers = await instance();
    let url = `${API_URL}/office-locations?page=${page}&take=${take}`;
    if (search) {
      url += `&q=${search}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch office locations';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (response.status === 403) {
        errorMessage =
          "You don't have permission to view office locations. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage,
        data: [],
        meta: null
      };
    }

    const result = await response.json();

    return {
      success: true,
      data: result.data || [],
      meta: result.meta || null
    };
  } catch (error) {
    console.error('getOfficeLocations error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: null
    };
  }
}

export async function createOfficeLocation(data: { name: string }) {
  try {
    const headers = await instance();

    const response = await fetch(`${API_URL}/office-locations`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create office location';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (response.status === 403) {
        errorMessage =
          "You don't have permission to create office locations. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/office-locations');

    return {
      success: true,
      message: result.message || 'Office location created successfully',
      data: result.data
    };
  } catch (error) {
    console.error('createOfficeLocation error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function updateOfficeLocation(data: {
  id: string;
  name?: string;
  isActive?: boolean;
}) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/office-locations/${data.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update office location';

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
    revalidatePath('/dashboard/office-locations');

    return {
      success: true,
      message: result.message || 'Office location updated successfully'
    };
  } catch (error) {
    console.error('updateOfficeLocation error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function deleteOfficeLocation(id: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/office-locations/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete office location';

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
    revalidatePath('/dashboard/office-locations');

    return {
      success: true,
      message: result.message || 'Office location deleted successfully'
    };
  } catch (error) {
    console.error('deleteOfficeLocation error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
