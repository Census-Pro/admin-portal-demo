'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL = process.env.COMMON_SERVICE || 'http://localhost:5003';

// Dummy operators data
const DUMMY_OPERATORS = [
  { id: '1', name: 'Census Officer', cidNo: '11001000001', isActive: true },
  { id: '2', name: 'Field Supervisor', cidNo: '11001000002', isActive: true },
  {
    id: '3',
    name: 'Data Entry Operator',
    cidNo: '11001000003',
    isActive: true
  },
  {
    id: '4',
    name: 'Verification Officer',
    cidNo: '11001000004',
    isActive: true
  },
  { id: '5', name: 'Team Lead', cidNo: '11001000005', isActive: true },
  { id: '6', name: 'Senior Enumerator', cidNo: '11001000006', isActive: true },
  { id: '7', name: 'Junior Enumerator', cidNo: '11001000007', isActive: true },
  {
    id: '8',
    name: 'Volunteer Enumerator',
    cidNo: '11001000008',
    isActive: true
  },
  { id: '9', name: 'IT Support Staff', cidNo: '11001000009', isActive: true },
  {
    id: '10',
    name: 'Administrative Officer',
    cidNo: '11001000010',
    isActive: true
  }
];

export async function getOperators({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getOperators called with dummy data:', { page, limit, search });

  try {
    // Filter operators based on search query
    let filteredOperators = DUMMY_OPERATORS;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredOperators = DUMMY_OPERATORS.filter((operator) =>
        operator.name.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOperators = filteredOperators.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedOperators,
      meta: {
        page: currentPage,
        take: pageSize,
        itemCount: filteredOperators.length
      }
    };
  } catch (error) {
    console.error('Error fetching operators:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: { page: 0, take: 0, itemCount: 0 }
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
