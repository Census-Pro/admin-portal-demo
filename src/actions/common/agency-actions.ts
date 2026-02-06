'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL =
  process.env.AUTH_SERVICE || process.env.API_URL || 'http://localhost:5001';

export async function getAgencies({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  try {
    const headers = await instance();
    let url = `${API_URL}/agencies?page=${page}&take=${limit}`;
    if (search) {
      url += `&q=${search}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch agencies';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to view agencies. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage,
        data: []
      };
    }

    const result = await response.json();

    return {
      success: true,
      data: result.data || [],
      totalItems: result.meta?.itemCount || (result.data || []).length
    };
  } catch (error) {
    console.error('getAgencies error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    };
  }
}

export async function createAgency(data: { name: string; code?: string }) {
  try {
    const headers = await instance();

    const response = await fetch(`${API_URL}/agencies`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create agency';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to create agencies. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/agencies');

    return {
      success: true,
      message: result.message || 'Agency created successfully',
      data: result.data
    };
  } catch (error) {
    console.error('createAgency error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function updateAgency(data: {
  id: string;
  name?: string;
  code?: string;
  isActive?: boolean;
}) {
  try {
    const { id, ...updateData } = data;
    const headers = await instance();
    const response = await fetch(`${API_URL}/agencies/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update agency';

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
    revalidatePath('/dashboard/agencies');

    return {
      success: true,
      message: result.message || 'Agency updated successfully'
    };
  } catch (error) {
    console.error('updateAgency error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function deleteAgency(id: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/agencies/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete agency';

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
    revalidatePath('/dashboard/agencies');

    return {
      success: true,
      message: result.message || 'Agency deleted successfully'
    };
  } catch (error) {
    console.error('deleteAgency error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
