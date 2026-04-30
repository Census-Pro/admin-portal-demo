'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createLiteracyStatus(formData: any) {
  try {
    const response = await fetch(`${API_URL}/literacy-statuses`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add literacy status';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/(masters)/literacy-status');
    return data;
  } catch (error) {
    console.error('Error creating literacy status:', error);
    return { error: true, message: 'Failed to add literacy status' };
  }
}

// Dummy literacy status data
const DUMMY_LITERACY_STATUS = [
  { id: '1', name: 'Literate', isActive: true },
  { id: '2', name: 'Semi-literate', isActive: true },
  { id: '3', name: 'Non-literate', isActive: true },
  { id: '4', name: 'Not Applicable', isActive: true }
];

export async function getLiteracyStatuses({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getLiteracyStatuses called with dummy data:', {
    page,
    limit,
    search
  });

  try {
    // Filter literacy status based on search query
    let filteredStatus = DUMMY_LITERACY_STATUS;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredStatus = filteredStatus.filter((status) =>
        status.name.toLowerCase().includes(searchLower)
      );
    }

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
    console.error('Error fetching literacy statuses:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: { page: 0, take: 0, itemCount: 0 }
    };
  }
}

export async function deleteLiteracyStatus(id?: string) {
  try {
    const response = await fetch(`${API_URL}/literacy-statuses/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete literacy status: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/(masters)/literacy-status');
    return { error: false, message: 'Literacy status deleted successfully' };
  } catch (error) {
    console.error('Error deleting literacy status:', error);
    return { error: true, message: 'Failed to delete literacy status' };
  }
}

export async function updateLiteracyStatus(id: string, data: any) {
  const response = await fetch(`${API_URL}/literacy-statuses/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message ||
      'Failed to update literacy status';
    return { error: true, message: errorMessage };
  }

  revalidatePath('/dashboard/(masters)/literacy-status');
  return res;
}
