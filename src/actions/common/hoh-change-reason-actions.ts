'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createHohChangeReasons(formData: any) {
  try {
    const response = await fetch(`${API_URL}/hoh-change-reason`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add HOH change reason';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/hoh-change-reason');
    return data;
  } catch (error) {
    console.error('Error creating HOH change reason:', error);
    return { error: true, message: 'Failed to add HOH change reason' };
  }
}

// Dummy HOH change reasons data
const DUMMY_HOH_CHANGE_REASONS = [
  { id: '1', name: 'Death of Head of Household', isActive: true },
  { id: '2', name: 'Migration of Head of Household', isActive: true },
  { id: '3', name: 'Marriage of New Head of Household', isActive: true },
  { id: '4', name: 'Divorce of Head of Household', isActive: true },
  { id: '5', name: 'Abandonment by Head of Household', isActive: true },
  { id: '6', name: 'Incapacity of Head of Household', isActive: true },
  { id: '7', name: 'Change due to Court Order', isActive: true },
  { id: '8', name: 'Change due to Adoption', isActive: true },
  { id: '9', name: 'Change due to Legal Separation', isActive: true },
  { id: '10', name: 'Change due to Correction of Errors', isActive: true }
];

export async function getHohChangeReasons({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getHohChangeReasons called with dummy data:', {
    page,
    limit,
    search
  });

  try {
    // Filter HOH change reasons based on search query
    let filteredReasons = DUMMY_HOH_CHANGE_REASONS;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredReasons = DUMMY_HOH_CHANGE_REASONS.filter((reason) =>
        reason.name.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedReasons = filteredReasons.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedReasons,
      meta: {
        page: currentPage,
        take: pageSize,
        itemCount: filteredReasons.length
      }
    };
  } catch (error) {
    console.error('Error fetching HOH change reasons:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: { page: 0, take: 0, itemCount: 0 }
    };
  }
}

export async function getAllHohChangeReasons() {
  try {
    const response = await fetch(`${API_URL}/hoh-change-reason`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch HOH change reasons: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching HOH change reasons:', error);
    return [];
  }
}

export async function deleteHohChangeReason(id?: string) {
  try {
    const response = await fetch(`${API_URL}/hoh-change-reason/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete HOH change reason: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/hoh-change-reason');
    return { error: false, message: 'HOH Change Reason deleted successfully' };
  } catch (error) {
    console.error('Error deleting HOH change reason:', error);
    return { error: true, message: 'Failed to delete HOH change reason' };
  }
}

export async function updateHohChangeReason(id: string, data: any) {
  const response = await fetch(`${API_URL}/hoh-change-reason/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message ||
      'Failed to update HOH change reason';
    return { error: true, message: errorMessage };
  }

  revalidatePath('/dashboard/hoh-change-reason');
  return res;
}
