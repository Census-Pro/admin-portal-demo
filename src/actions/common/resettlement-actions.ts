'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL = process.env.N_R_M_SERVICE || 'http://localhost:5009';

// Transform API response from snake_case to camelCase
function transformResettlementData(item: any) {
  if (!item) return null;
  return {
    id: item.id,
    cidNo: item.cid_no,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

export async function getResettlements({
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

    const url = `${API_URL}/resettlement${params.toString() ? `?${params.toString()}` : ''}`;

    console.log('[getResettlements] URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch resettlement';

      try {
        const error = await response.json();
        console.error('[getResettlements] Error response:', error);
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 404) {
        errorMessage =
          'Resettlement endpoint not found. Please ensure the backend service is running and the endpoint is configured.';
      } else if (response.status === 403) {
        errorMessage =
          "You don't have permission to view resettlement. Please contact your administrator.";
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
    console.log('[getResettlements] Success response:', result);

    // Handle different response formats
    const data = result.data || result.items || result || [];
    const totalItems =
      result.meta?.totalItems ||
      result.meta?.itemCount ||
      result.total ||
      (Array.isArray(data) ? data.length : 0);

    // Transform snake_case to camelCase
    const transformedData = Array.isArray(data)
      ? data.map(transformResettlementData).filter(Boolean)
      : [];

    return {
      success: true,
      data: transformedData,
      totalItems
    };
  } catch (error) {
    console.error('[getResettlements] Unexpected error:', error);
    console.error('[getResettlements] Error details:', {
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

export async function getAllResettlements() {
  try {
    const headers = await instance();
    const url = `${API_URL}/resettlement/all`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch all resettlement';

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
    const data = result.data || result || [];

    // Transform snake_case to camelCase
    const transformedData = Array.isArray(data)
      ? data.map(transformResettlementData).filter(Boolean)
      : [];

    return {
      success: true,
      data: transformedData
    };
  } catch (error) {
    console.error('getAllResettlements error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    };
  }
}

export async function getResettlementById(id: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/resettlement/${id}`, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch resettlement';

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
    const data = result.data || result;

    return {
      success: true,
      data: transformResettlementData(data)
    };
  } catch (error) {
    console.error('getResettlementById error:', error);
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
    const response = await fetch(`${API_URL}/resettlement/check/${cidNo}`, {
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
    console.error('checkNameExists error:', error);
    return {
      success: false,
      exists: false
    };
  }
}

export async function createResettlement(data: { cid_no: string }) {
  try {
    const headers = await instance();

    const response = await fetch(`${API_URL}/resettlement`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create resettlement';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to create resettlement. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/resettlement');

    return {
      success: true,
      message: result.message || 'Resettlement created successfully',
      data: result.data
    };
  } catch (error) {
    console.error('createResettlement error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function updateResettlement(data: {
  id: string;
  cid_no?: string;
}) {
  try {
    const { id, ...updateData } = data;
    const headers = await instance();
    const response = await fetch(`${API_URL}/resettlement/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update resettlement';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to update resettlement. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/resettlement');

    return {
      success: true,
      message: result.message || 'Resettlement updated successfully',
      data: result.data
    };
  } catch (error) {
    console.error('updateResettlement error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function deleteResettlement(id: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/resettlement/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete resettlement';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to delete resettlement. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    revalidatePath('/dashboard/resettlement');

    return {
      success: true,
      message: 'Resettlement deleted successfully'
    };
  } catch (error) {
    console.error('deleteResettlement error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
