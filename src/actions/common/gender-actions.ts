'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createGenders(formData: any) {
  try {
    const response = await fetch(`${API_URL}/genders`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message || 'Failed to add genders';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/genders');
    return data;
  } catch (error) {
    console.error('Error creating gender:', error);
    return { error: true, message: 'Failed to add genders' };
  }
}

// Dummy genders data
const DUMMY_GENDERS = [
  { id: '1', name: 'Male', isActive: true },
  { id: '2', name: 'Female', isActive: true },
  { id: '3', name: 'Other', isActive: true }
];

export async function getGenders({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getGenders called with dummy data:', { page, limit, search });

  try {
    // Filter genders based on search query
    let filteredGenders = DUMMY_GENDERS;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredGenders = DUMMY_GENDERS.filter((gender) =>
        gender.name.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedGenders = filteredGenders.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedGenders,
      meta: {
        page: currentPage,
        take: pageSize,
        itemCount: filteredGenders.length
      }
    };
  } catch (error) {
    console.error('Error fetching genders:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: { page: 0, take: 0, itemCount: 0 }
    };
  }
}

export async function getAllGenders() {
  try {
    const response = await fetch(`${API_URL}/genders/all`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch genders: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching genders:', error);
  }
}

export async function deleteGender(id?: string) {
  try {
    const response = await fetch(`${API_URL}/genders/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete gender: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/genders');
    return { error: false, message: 'Gender deleted successfully' };
  } catch (error) {
    console.error('Error deleting gender:', error);
    return { error: true, message: 'Failed to delete gender' };
  }
}

export async function updateGender(id: string, data: any) {
  const response = await fetch(`${API_URL}/genders/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message || 'Failed to update gender';
    return { error: true, message: errorMessage };
  }

  revalidatePath('/dashboard/genders');
  return res;
}
