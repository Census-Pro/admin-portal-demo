'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createRegularizationType(formData: any) {
  try {
    const response = await fetch(`${API_URL}/regularization-types`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add regularization type';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/(masters)/regularization-types');
    return data;
  } catch (error) {
    console.error('Error creating regularization type:', error);
    return { error: true, message: 'Failed to add regularization type' };
  }
}

// Dummy regularization types data
const DUMMY_REGULARIZATION_TYPES = [
  { id: '1', name: 'Residence Regularization', isActive: true },
  { id: '2', name: 'Marriage Regularization', isActive: true },
  { id: '3', name: 'Birth Regularization', isActive: true },
  { id: '4', name: 'Death Regularization', isActive: true },
  { id: '5', name: 'Migration Regularization', isActive: true },
  { id: '6', name: 'Name Change Regularization', isActive: true },
  { id: '7', name: 'Address Change Regularization', isActive: true },
  { id: '8', name: 'Citizenship Regularization', isActive: true },
  { id: '9', name: 'Property Regularization', isActive: true }
];

export async function getRegularizationTypes({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getRegularizationTypes called with dummy data:', {
    page,
    limit,
    search
  });

  try {
    // Filter regularization types based on search query
    let filteredTypes = DUMMY_REGULARIZATION_TYPES;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTypes = DUMMY_REGULARIZATION_TYPES.filter((type) =>
        type.name.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTypes = filteredTypes.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedTypes,
      meta: {
        page: currentPage,
        take: pageSize,
        itemCount: filteredTypes.length
      }
    };
  } catch (error) {
    console.error('Error fetching regularization types:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: { page: 0, take: 0, itemCount: 0 }
    };
  }
}

export async function getAllRegularizationTypes() {
  try {
    const response = await fetch(`${API_URL}/regularization-types/all`, {
      headers: await instance(),
      next: { tags: ['regularization-types'] }
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch regularization types: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching regularization types:', error);
    return [];
  }
}

export async function deleteRegularizationType(id?: string) {
  try {
    const response = await fetch(`${API_URL}/regularization-types/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete regularization type: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/(masters)/regularization-types');
    return {
      error: false,
      message: 'Regularization type deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting regularization type:', error);
    return { error: true, message: 'Failed to delete regularization type' };
  }
}
export async function updateRegularizationType(id: string, data: any) {
  const response = await fetch(`${API_URL}/regularization-types/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message ||
      'Failed to update regularization type';
    return { error: true, message: errorMessage };
  }

  revalidatePath('/dashboard/(masters)/regularization-types');
  return res;
}
