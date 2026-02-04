'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL = process.env.COMMON_SERVICE;

export async function getRelationships({
  page = 1,
  limit = 10,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  try {
    const headers = await instance();
    let url = `${API_URL}/relationships?page=${page}&take=${limit}`;

    if (search) {
      url += `&name=${search}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch relationships';

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
          "You don't have permission to view relationships. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage,
        data: [],
        meta: { page: 0, take: 0, itemCount: 0 }
      };
    }

    const result = await response.json();

    return {
      success: true,
      data: result.data || [],
      meta: result.meta || { page: 0, take: 0, itemCount: 0 }
    };
  } catch (error) {
    console.error('getRelationships error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: { page: 0, take: 0, itemCount: 0 }
    };
  }
}

export async function getAllRelationships() {
  try {
    const headers = await instance();
    const url = `${API_URL}/relationships/all`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      next: { tags: ['relationships'] }
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to fetch all relationships',
        data: []
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result || []
    };
  } catch (error) {
    console.error('getAllRelationships error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    };
  }
}

export async function getRelationshipById(id: string) {
  try {
    const headers = await instance();
    const url = `${API_URL}/relationships/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch relationship';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('getRelationshipById error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: null
    };
  }
}

export async function createRelationship(data: { name: string }) {
  try {
    const headers = await instance();

    const response = await fetch(`${API_URL}/relationships`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create relationship';

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
          "You don't have permission to create relationships. Please contact your administrator.";
      } else if (response.status === 409) {
        errorMessage = 'A relationship with this name already exists.';
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/relationship-types');

    return {
      success: true,
      message: result.message || 'Relationship created successfully',
      data: result
    };
  } catch (error) {
    console.error('createRelationship error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function updateRelationship(data: { id: string; name: string }) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/relationships/${data.id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ name: data.name })
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update relationship';

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
          "You don't have permission to update relationships. Please contact your administrator.";
      } else if (response.status === 409) {
        errorMessage = 'A relationship with this name already exists.';
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/relationship-types');

    return {
      success: true,
      message: result.message || 'Relationship updated successfully',
      data: result
    };
  } catch (error) {
    console.error('updateRelationship error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function deleteRelationship(id: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/relationships/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete relationship';

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
          "You don't have permission to delete relationships. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    revalidatePath('/dashboard/relationship-types');

    return {
      success: true,
      message: 'Relationship deleted successfully'
    };
  } catch (error) {
    console.error('deleteRelationship error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
