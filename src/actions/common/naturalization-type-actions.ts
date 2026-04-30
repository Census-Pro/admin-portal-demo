'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createNaturalizationType(formData: any) {
  try {
    const response = await fetch(`${API_URL}/naturalization-types`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add naturalization type';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/(masters)/naturalization-types');
    return data;
  } catch (error) {
    console.error('Error creating naturalization type:', error);
    return { error: true, message: 'Failed to add naturalization type' };
  }
}

// Dummy naturalization types data
const DUMMY_NATURALIZATION_TYPES = [
  { id: '1', name: 'Birth Registration', isActive: true },
  { id: '2', name: 'Residence Registration', isActive: true },
  { id: '3', name: 'Marriage Registration', isActive: true },
  { id: '4', name: 'Death Registration', isActive: true },
  { id: '5', name: 'Migration Registration', isActive: true },
  { id: '6', name: 'Special Registration', isActive: true },
  { id: '7', name: 'Court Order Registration', isActive: true },
  { id: '8', name: 'Adoption Registration', isActive: true }
];

export async function getNaturalizationTypes({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getNaturalizationTypes called with dummy data:', {
    page,
    limit,
    search
  });

  try {
    // Filter naturalization types based on search query
    let filteredTypes = DUMMY_NATURALIZATION_TYPES;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTypes = filteredTypes.filter((type) =>
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
    console.error('Error fetching naturalization types:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: { page: 0, take: 0, itemCount: 0 }
    };
  }
}

export async function deleteNaturalizationType(id?: string) {
  try {
    const response = await fetch(`${API_URL}/naturalization-types/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete naturalization type: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/(masters)/naturalization-types');
    return {
      error: false,
      message: 'Naturalization type deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting naturalization type:', error);
    return { error: true, message: 'Failed to delete naturalization type' };
  }
}

export async function updateNaturalizationType(id: string, data: any) {
  const response = await fetch(`${API_URL}/naturalization-types/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message ||
      'Failed to update naturalization type';
    return { error: true, message: errorMessage };
  }

  revalidatePath('/dashboard/(masters)/naturalization-types');
  return res;
}
