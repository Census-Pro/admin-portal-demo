'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createMaritalStatus(formData: any) {
  try {
    const response = await fetch(`${API_URL}/marital-statuses`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add marital status';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/(masters)/marital-status');
    return data;
  } catch (error) {
    console.error('Error creating marital status:', error);
    return { error: true, message: 'Failed to add marital status' };
  }
}

// Dummy marital status data
const DUMMY_MARITAL_STATUS = [
  { id: '1', name: 'Single', isActive: true },
  { id: '2', name: 'Married', isActive: true },
  { id: '3', name: 'Divorced', isActive: true },
  { id: '4', name: 'Widowed', isActive: true },
  { id: '5', name: 'Separated', isActive: true }
];

export async function getMaritalStatuses({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getMaritalStatuses called with dummy data:', {
    page,
    limit,
    search
  });

  try {
    // Filter marital status based on search query
    let filteredStatus = DUMMY_MARITAL_STATUS;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredStatus = DUMMY_MARITAL_STATUS.filter((status) =>
        status.name.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedStatus = filteredStatus.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedStatus,
      meta: {
        page: currentPage,
        take: pageSize,
        itemCount: filteredStatus.length
      }
    };
  } catch (error) {
    console.error('Error fetching marital status:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: { page: 0, take: 0, itemCount: 0 }
    };
  }
}

export async function getAllMaritalStatuses() {
  try {
    const response = await fetch(`${API_URL}/marital-statuses/all`, {
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch marital statuses: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching marital statuses:', error);
  }
}

export async function deleteMaritalStatus(id?: string) {
  try {
    const response = await fetch(`${API_URL}/marital-statuses/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete marital status: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/(masters)/marital-status');
    return { error: false, message: 'Marital status deleted successfully' };
  } catch (error) {
    console.error('Error deleting marital status:', error);
    return { error: true, message: 'Failed to delete marital status' };
  }
}

export async function updateMaritalStatus(id: string, data: any) {
  const response = await fetch(`${API_URL}/marital-statuses/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message ||
      'Failed to update marital status';
    return { error: true, message: errorMessage };
  }

  revalidatePath('/dashboard/(masters)/marital-status');
  return res;
}
