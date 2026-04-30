'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createCidApplicationReason(formData: any) {
  try {
    const response = await fetch(`${API_URL}/cid-application-reasons`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        data?.message ||
        'Failed to add CID application reason';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/cid-application-reasons');
    return data;
  } catch (error) {
    console.error('Error creating CID application reason:', error);
    return { error: true, message: 'Failed to add CID application reason' };
  }
}

// Dummy CID application reasons data
const DUMMY_CID_APPLICATION_REASONS = [
  { id: '1', name: 'First Time Application', isActive: true },
  { id: '2', name: 'Lost CID', isActive: true },
  { id: '3', name: 'Damaged CID', isActive: true },
  { id: '4', name: 'CID Expiry Renewal', isActive: true },
  { id: '5', name: 'Name Change', isActive: true },
  { id: '6', name: 'Address Change', isActive: true },
  { id: '7', name: 'Date of Birth Correction', isActive: true },
  { id: '8', name: 'Gender Change', isActive: true },
  { id: '9', name: 'Replacement due to wear and tear', isActive: true },
  { id: '10', name: 'Replacement due to system upgrade', isActive: true },
  { id: '11', name: 'Replacement for minor corrections', isActive: true },
  { id: '12', name: 'Replacement due to security reasons', isActive: true }
];

export async function getCidApplicationReasons({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getCidApplicationReasons called with dummy data:', {
    page,
    limit,
    search
  });

  try {
    // Filter CID application reasons based on search query
    let filteredReasons = DUMMY_CID_APPLICATION_REASONS;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredReasons = DUMMY_CID_APPLICATION_REASONS.filter((reason) =>
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
    console.error('Error fetching CID application reasons:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: { page: 0, take: 0, itemCount: 0 }
    };
  }
}

export async function getAllCidApplicationReasons() {
  try {
    const response = await fetch(`${API_URL}/cid-application-reasons/all`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch CID application reasons: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching CID application reasons:', error);
  }
}

export async function getCidApplicationReasonById(id: string) {
  try {
    const response = await fetch(`${API_URL}/cid-application-reasons/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch CID application reason: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching CID application reason:', error);
    return {
      error: true,
      message: 'Failed to fetch CID application reason'
    };
  }
}

export async function deleteCidApplicationReason(id?: string) {
  try {
    const response = await fetch(`${API_URL}/cid-application-reasons/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete CID application reason: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/cid-application-reasons');
    return {
      error: false,
      message: 'CID application reason deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting CID application reason:', error);
    return { error: true, message: 'Failed to delete CID application reason' };
  }
}

export async function updateCidApplicationReason(id: string, data: any) {
  try {
    const response = await fetch(`${API_URL}/cid-application-reasons/${id}`, {
      method: 'PATCH',
      headers: await instance(),
      body: JSON.stringify(data)
    });

    const res = await response.json();

    if (!response.ok || res?.error) {
      const errorMessage =
        (res?.error as ApiErrorResponse)?.message ||
        'Failed to update CID application reason';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/cid-application-reasons');
    return res;
  } catch (error) {
    console.error('Error updating CID application reason:', error);
    return { error: true, message: 'Failed to update CID application reason' };
  }
}
