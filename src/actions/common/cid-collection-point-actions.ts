'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL = process.env.COMMON_SERVICE || 'http://localhost:5003';

// Dummy CID collection points data
const DUMMY_CID_COLLECTION_POINTS = [
  { id: '1', name: 'Dzongkhag Office', isActive: true },
  { id: '2', name: 'Thimphu Office', isActive: true },
  { id: '3', name: 'Paro Office', isActive: true },
  { id: '4', name: 'Punakha Office', isActive: true },
  { id: '5', name: 'Wangdue Office', isActive: true },
  { id: '6', name: 'Trongsa Office', isActive: true },
  { id: '7', name: 'Bumthang Office', isActive: true },
  { id: '8', name: 'Lhuentse Office', isActive: true },
  { id: '9', name: 'Mongar Office', isActive: true },
  { id: '10', name: 'Samdrup Jongkhar Office', isActive: true },
  { id: '11', name: 'Trashigang Office', isActive: true },
  { id: '12', name: 'Sarpang Office', isActive: true },
  { id: '13', name: 'Samtse Office', isActive: true },
  { id: '14', name: 'Zhemgang Office', isActive: true },
  { id: '15', name: 'Haa Office', isActive: true },
  { id: '16', name: 'Gasa Office', isActive: true },
  { id: '17', name: 'Chukha Office', isActive: true },
  { id: '18', name: 'Dagana Office', isActive: true },
  { id: '19', name: 'Laya Office', isActive: true },
  { id: '20', name: 'Pemagatshel Office', isActive: true }
];

export async function getCidCollectionPoints({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getCidCollectionPoints called with dummy data:', {
    page,
    limit,
    search
  });

  try {
    // Filter CID collection points based on search query
    let filteredPoints = DUMMY_CID_COLLECTION_POINTS;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPoints = DUMMY_CID_COLLECTION_POINTS.filter((point) =>
        point.name.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPoints = filteredPoints.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedPoints,
      meta: {
        page: currentPage,
        take: pageSize,
        itemCount: filteredPoints.length
      }
    };
  } catch (error) {
    console.error('Error fetching CID collection points:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: { page: 0, take: 0, itemCount: 0 }
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
