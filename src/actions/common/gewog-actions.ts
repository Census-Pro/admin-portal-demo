'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createGewogs(formData: any) {
  try {
    const response = await fetch(`${API_URL}/gewogs`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message || 'Failed to add gewogs';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/gewogs');
    return data;
  } catch (error) {
    console.error('Error creating gewog:', error);
    return { error: true, message: 'Failed to add gewogs' };
  }
}

// Dummy gewogs data
const DUMMY_GEWOGS = [
  {
    id: '1',
    name: 'Chang',
    dzongkhagId: '1',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '2',
    name: 'Dagala',
    dzongkhagId: '1',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '3',
    name: 'Genekha',
    dzongkhagId: '1',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '4',
    name: 'Kawang',
    dzongkhagId: '1',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '5',
    name: 'Lingzhi',
    dzongkhagId: '1',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '6',
    name: 'Mewang',
    dzongkhagId: '1',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '7',
    name: 'Naro',
    dzongkhagId: '1',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '8',
    name: 'Soe',
    dzongkhagId: '1',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '9',
    name: 'Toepisa',
    dzongkhagId: '1',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '10',
    name: 'Barp',
    dzongkhagId: '2',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '11',
    name: 'Dogar',
    dzongkhagId: '2',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '12',
    name: 'Dopshari',
    dzongkhagId: '2',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '13',
    name: 'Hungrel',
    dzongkhagId: '2',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '14',
    name: 'Lamgong',
    dzongkhagId: '2',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '15',
    name: 'Lungnyi',
    dzongkhagId: '2',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '16',
    name: 'Shaba',
    dzongkhagId: '2',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '17',
    name: 'Shapa',
    dzongkhagId: '2',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '18',
    name: 'Tsento',
    dzongkhagId: '2',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '19',
    name: 'Wangchang',
    dzongkhagId: '2',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '20',
    name: 'Bajo',
    dzongkhagId: '3',
    dzongkhagName: 'Punakha',
    isActive: true
  }
];

export async function getGewogs({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getGewogs called with dummy data:', { page, limit, search });

  try {
    // Filter gewogs based on search query
    let filteredGewogs = DUMMY_GEWOGS;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredGewogs = DUMMY_GEWOGS.filter(
        (gewog) =>
          gewog.name.toLowerCase().includes(searchLower) ||
          gewog.dzongkhagName.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedGewogs = filteredGewogs.slice(startIndex, endIndex);

    return {
      page: currentPage,
      limit: pageSize,
      totalGewogs: filteredGewogs.length,
      gewogs: paginatedGewogs
    };
  } catch (error) {
    console.error('Error fetching gewogs:', error);
    return {
      page: 0,
      limit: 0,
      totalGewogs: 0,
      gewogs: []
    };
  }
}

export async function getAllGewogs() {
  console.log('getAllGewogs called with dummy data');

  try {
    return DUMMY_GEWOGS;
  } catch (error) {
    console.error('Error fetching gewogs:', error);
    return [];
  }
}

export async function getGewogById(id: string) {
  try {
    const response = await fetch(`${API_URL}/gewogs/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch gewog: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching gewog:', error);
    return {
      error: true,
      message: 'Failed to fetch gewog'
    };
  }
}

export async function deleteGewog(id?: string) {
  try {
    const response = await fetch(`${API_URL}/gewogs/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete gewog: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/gewogs');
  } catch (error) {
    console.error('Error deleting gewog:', error);
    return null;
  }
}

export async function updateGewog(id: string, data: any) {
  const response = await fetch(`${API_URL}/gewogs/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message || 'Failed to update gewog';
    return { error: true, message: errorMessage };
  }

  revalidatePath('/dashboard/gewogs');
  return res;
}
