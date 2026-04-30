'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createDzongkhags(formData: any) {
  try {
    const response = await fetch(`${API_URL}/dzongkhags`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add dzongkhags';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/dzongkhags');
    return data;
  } catch (error) {
    console.error('Error creating dzongkhag:', error);
    return { error: true, message: 'Failed to add dzongkhags' };
  }
}

// Dummy dzongkhags data
const DUMMY_DZONGKHAGS = [
  { id: '1', name: 'Thimphu', code: 'THI', isActive: true },
  { id: '2', name: 'Paro', code: 'PAR', isActive: true },
  { id: '3', name: 'Punakha', code: 'PUN', isActive: true },
  { id: '4', name: 'Wangdue Phodrang', code: 'WAN', isActive: true },
  { id: '5', name: 'Lhuentse', code: 'LHU', isActive: true },
  { id: '6', name: 'Mongar', code: 'MON', isActive: true },
  { id: '7', name: 'Trashigang', code: 'TRA', isActive: true },
  { id: '8', name: 'Yangtse', code: 'YAN', isActive: true },
  { id: '9', name: 'Lhuentse', code: 'LHU', isActive: true },
  { id: '10', name: 'Pemagatshel', code: 'PEM', isActive: true },
  { id: '11', name: 'Zhemgang', code: 'ZHE', isActive: true },
  { id: '12', name: 'Sarpang', code: 'SAR', isActive: true },
  { id: '13', name: 'Samtse', code: 'SAM', isActive: true },
  { id: '14', name: 'Chukha', code: 'CHU', isActive: true },
  { id: '15', name: 'Haa', code: 'HAA', isActive: true },
  { id: '16', name: 'Gasa', code: 'GAS', isActive: true },
  { id: '17', name: 'Bumthang', code: 'BUM', isActive: true },
  { id: '18', name: 'Trongsa', code: 'TRG', isActive: true },
  { id: '19', name: 'Dagana', code: 'DAG', isActive: true },
  { id: '20', name: 'Tsirang', code: 'TSI', isActive: true }
];

export async function getDzongkhags({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getDzongkhags called with dummy data:', { page, limit, search });

  try {
    // Filter dzongkhags based on search query
    let filteredDzongkhags = DUMMY_DZONGKHAGS;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredDzongkhags = DUMMY_DZONGKHAGS.filter(
        (dzongkhag) =>
          dzongkhag.name.toLowerCase().includes(searchLower) ||
          dzongkhag.code.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedDzongkhags = filteredDzongkhags.slice(startIndex, endIndex);

    return {
      page: currentPage,
      limit: pageSize,
      totalDzongkhags: filteredDzongkhags.length,
      dzongkhags: paginatedDzongkhags
    };
  } catch (error) {
    console.error('Error fetching dzongkhags:', error);
    return {
      page: 0,
      limit: 0,
      totalDzongkhags: 0,
      dzongkhags: []
    };
  }
}

export async function getAllDzongkhags() {
  console.log('getAllDzongkhags called with dummy data');

  try {
    return DUMMY_DZONGKHAGS;
  } catch (error) {
    console.error('Error fetching dzongkhags:', error);
    return [];
  }
}

export async function getDzongkhagById(id: string) {
  try {
    const response = await fetch(`${API_URL}/dzongkhags/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch dzongkhag: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching dzongkhag:', error);
    return {
      error: true,
      message: 'Failed to fetch dzongkhag'
    };
  }
}

export async function deleteDzongkhag(id?: string) {
  try {
    const response = await fetch(`${API_URL}/dzongkhags/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete dzongkhag: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/dzongkhags');
    return { error: false, message: 'Dzongkhag deleted successfully' };
  } catch (error) {
    console.error('Error deleting dzongkhag:', error);
    return { error: true, message: 'Failed to delete dzongkhag' };
  }
}

export async function updateDzongkhag(id: string, data: any) {
  const response = await fetch(`${API_URL}/dzongkhags/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message || 'Failed to update dzongkhag';
    return { error: true, message: errorMessage };
  }

  revalidatePath('/dashboard/dzongkhags');
  return res;
}
