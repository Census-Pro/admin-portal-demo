'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL =
  process.env.AUTH_SERVICE || process.env.API_URL || 'http://localhost:5001';

// Dummy agencies data
const DUMMY_AGENCIES = [
  {
    id: '1',
    name: 'Ministry of Home Affairs',
    code: 'MOHA',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Department of Immigration',
    code: 'DOI',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Regional Immigration Office',
    code: 'RIO',
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Dzongkhag Administration',
    code: 'DZA',
    isActive: true,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Local Government Office',
    code: 'LGO',
    isActive: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '6',
    name: 'Civil Registration Office',
    code: 'CRO',
    isActive: true,
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z'
  },
  {
    id: '7',
    name: 'National Registration Office',
    code: 'NRO',
    isActive: true,
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z'
  },
  {
    id: '8',
    name: 'Department of Law and Order',
    code: 'DLO',
    isActive: true,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: '9',
    name: 'Bureau of Law and Order',
    code: 'BLO',
    isActive: true,
    createdAt: '2024-01-09T00:00:00Z',
    updatedAt: '2024-01-09T00:00:00Z'
  },
  {
    id: '10',
    name: 'Royal Bhutan Police',
    code: 'RBP',
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '11',
    name: 'Immigration Division',
    code: 'IDD',
    isActive: true,
    createdAt: '2024-01-11T00:00:00Z',
    updatedAt: '2024-01-11T00:00:00Z'
  },
  {
    id: '12',
    name: 'Passport Division',
    code: 'PAD',
    isActive: true,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  }
];

export async function getAgencies({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getAgencies called with dummy data:', { page, limit, search });

  try {
    // Filter agencies based on search query
    let filteredAgencies = DUMMY_AGENCIES;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredAgencies = DUMMY_AGENCIES.filter(
        (agency) =>
          agency.name.toLowerCase().includes(searchLower) ||
          agency.code.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedAgencies = filteredAgencies.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedAgencies,
      totalItems: filteredAgencies.length
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
