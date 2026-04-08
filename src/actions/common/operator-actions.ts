'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL = process.env.COMMON_SERVICE || 'http://localhost:5003';

export async function getOperators({
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

    // Build query params - backend expects 'take' not 'limit', and 'cidNo' not 'search'
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('take', limit.toString());
    if (search) params.append('cidNo', search);

    const url = `${API_URL}/operators${params.toString() ? `?${params.toString()}` : ''}`;

    console.log('[getOperators] URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch operators';

      try {
        const error = await response.json();
        console.error('[getOperators] Error response:', error);
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 404) {
        errorMessage =
          'Operators endpoint not found. Please ensure the backend service is running and the endpoint is configured.';
      } else if (response.status === 403) {
        errorMessage =
          "You don't have permission to view operators. Please contact your administrator.";
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized. Please log in again.';
      }

      return {
        success: false,
        error: errorMessage,
        data: [],
        totalItems: 0
      };
    }

    const result = await response.json();
    console.log('[getOperators] Success response:', result);

    // Handle different response formats
    const data = result.data || result.items || result || [];
    const totalItems =
      result.meta?.totalItems ||
      result.meta?.itemCount ||
      result.total ||
      (Array.isArray(data) ? data.length : 0);

    return {
      success: true,
      data: Array.isArray(data) ? data : [],
      totalItems
    };
  } catch (error) {
    console.error('[getOperators] Unexpected error:', error);
    console.error('[getOperators] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      totalItems: 0
    };
  }
}

export async function getAllOperators() {
  try {
    const headers = await instance();
    const url = `${API_URL}/operators/all`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch all operators';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
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
      data: result.data || result || []
    };
  } catch (error) {
    console.error('getAllOperators error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    };
  }
}

export async function getOperatorById(id: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/operators/${id}`, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch operator';

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
      data: result.data || result
    };
  } catch (error) {
    console.error('getOperatorById error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: null
    };
  }
}

export async function checkCidExists(cidNo: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/operators/check/${cidNo}`, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        success: false,
        exists: false
      };
    }

    const result = await response.json();

    return {
      success: true,
      exists: result.exists || false,
      data: result.data || null
    };
  } catch (error) {
    console.error('checkCidExists error:', error);
    return {
      success: false,
      exists: false
    };
  }
}

export async function createOperator(data: { cidNo: string }) {
  try {
    const headers = await instance();

    const response = await fetch(`${API_URL}/operators`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create operator';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to create operators. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/operators');

    return {
      success: true,
      message: result.message || 'Operator created successfully',
      data: result.data
    };
  } catch (error) {
    console.error('createOperator error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function updateOperator(data: { id: string; cidNo?: string }) {
  try {
    const { id, ...updateData } = data;
    const headers = await instance();
    const response = await fetch(`${API_URL}/operators/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update operator';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to update operators. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/operators');

    return {
      success: true,
      message: result.message || 'Operator updated successfully',
      data: result.data
    };
  } catch (error) {
    console.error('updateOperator error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function deleteOperator(id: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/operators/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete operator';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to delete operators. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    revalidatePath('/dashboard/operators');

    return {
      success: true,
      message: 'Operator deleted successfully'
    };
  } catch (error) {
    console.error('deleteOperator error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
