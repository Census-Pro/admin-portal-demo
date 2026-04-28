'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL = process.env.COMMON_SERVICE || 'http://localhost:5003';

export async function getCidCollectionPoints({
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

    // Build query params
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('take', limit.toString());
    if (search) params.append('name', search);

    const url = `${API_URL}/cid-collection-points${params.toString() ? `?${params.toString()}` : ''}`;

    console.log('[getCidCollectionPoints] URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch CID collection points';

      try {
        const error = await response.json();
        console.error('[getCidCollectionPoints] Error response:', error);
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 404) {
        errorMessage =
          'CID Collection Points endpoint not found. Please ensure the backend service is running and the endpoint is configured.';
      } else if (response.status === 403) {
        errorMessage =
          "You don't have permission to view CID collection points. Please contact your administrator.";
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
    console.log('[getCidCollectionPoints] Success response:', result);

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
    console.error('[getCidCollectionPoints] Unexpected error:', error);
    console.error('[getCidCollectionPoints] Error details:', {
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

export async function getAllCidCollectionPoints() {
  try {
    const headers = await instance();
    const url = `${API_URL}/cid-collection-points/all`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch all CID collection points';

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
    console.error('getAllCidCollectionPoints error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    };
  }
}

export async function getCidCollectionPointById(id: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/cid-collection-points/${id}`, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch CID collection point';

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
    console.error('getCidCollectionPointById error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: null
    };
  }
}

export async function checkNameExists(name: string, excludeId?: string) {
  try {
    const headers = await instance();
    const params = new URLSearchParams({ name });
    if (excludeId) params.append('excludeId', excludeId);

    const response = await fetch(
      `${API_URL}/cid-collection-points/check?${params.toString()}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      return {
        success: false,
        exists: false
      };
    }

    const result = await response.json();

    return {
      success: true,
      exists: result.exists || false
    };
  } catch (error) {
    console.error('checkNameExists error:', error);
    return {
      success: false,
      exists: false
    };
  }
}

export async function createCidCollectionPoint(data: { name: string }) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/cid-collection-points`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create CID collection point';

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

    revalidatePath('/dashboard/cid-collection-points');

    return {
      success: true,
      message: 'CID collection point created successfully',
      data: result.data || result
    };
  } catch (error) {
    console.error('createCidCollectionPoint error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function updateCidCollectionPoint(
  id: string,
  data: { name: string }
) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/cid-collection-points/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update CID collection point';

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

    revalidatePath('/dashboard/cid-collection-points');

    return {
      success: true,
      message: 'CID collection point updated successfully',
      data: result.data || result
    };
  } catch (error) {
    console.error('updateCidCollectionPoint error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function deleteCidCollectionPoint(id: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/cid-collection-points/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete CID collection point';

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

    revalidatePath('/dashboard/cid-collection-points');

    return {
      success: true,
      message: 'CID collection point deleted successfully'
    };
  } catch (error) {
    console.error('deleteCidCollectionPoint error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
