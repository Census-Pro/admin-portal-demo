'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL = process.env.N_R_M_SERVICE || 'http://localhost:5009';

interface ResettlementData {
  id: string;
  cidNo: string;
  createdAt?: string;
  updatedAt?: string;
}

// Transform API response from snake_case to camelCase
function transformResettlementData(item: any): ResettlementData | null {
  if (!item) return null;
  return {
    id: item.id,
    cidNo: item.cid_no || '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

// Dummy resettlements data
const DUMMY_RESETTLEMENTS = [
  {
    id: '1',
    cidNo: '11001000001',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    cidNo: '11001000002',
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20'
  },
  {
    id: '3',
    cidNo: '11001000003',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10'
  },
  {
    id: '4',
    cidNo: '11001000004',
    createdAt: '2024-04-05',
    updatedAt: '2024-04-05'
  },
  {
    id: '5',
    cidNo: '11001000005',
    createdAt: '2024-05-12',
    updatedAt: '2024-05-12'
  },
  {
    id: '6',
    cidNo: '11001000006',
    createdAt: '2024-06-18',
    updatedAt: '2024-06-18'
  },
  {
    id: '7',
    cidNo: '11001000007',
    createdAt: '2024-07-22',
    updatedAt: '2024-07-22'
  },
  {
    id: '8',
    cidNo: '11001000008',
    createdAt: '2024-08-30',
    updatedAt: '2024-08-30'
  },
  {
    id: '9',
    cidNo: '11001000009',
    createdAt: '2024-09-14',
    updatedAt: '2024-09-14'
  },
  {
    id: '10',
    cidNo: '11001000010',
    createdAt: '2024-10-25',
    updatedAt: '2024-10-25'
  }
];

export async function getResettlements({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getResettlements called with dummy data:', {
    page,
    limit,
    search
  });

  try {
    // Filter resettlements based on search query
    let filteredResettlements = DUMMY_RESETTLEMENTS;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredResettlements = DUMMY_RESETTLEMENTS.filter((resettlement) =>
        resettlement.cidNo.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResettlements = filteredResettlements.slice(
      startIndex,
      endIndex
    );

    return {
      success: true,
      data: paginatedResettlements,
      meta: {
        page: currentPage,
        take: pageSize,
        itemCount: filteredResettlements.length
      }
    };
  } catch (error) {
    console.error('Error fetching resettlements:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: { page: 0, take: 0, itemCount: 0 }
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
    const transformedData: ResettlementData[] = Array.isArray(data)
      ? data
          .map(transformResettlementData)
          .filter((item): item is ResettlementData => item !== null)
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
