'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createChiwog(formData: any) {
  try {
    const response = await fetch(`${API_URL}/chiwogs`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message || 'Failed to add chiwog';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/chiwogs');
    return data;
  } catch (error) {
    console.error('Error creating chiwog:', error);
    return { error: true, message: 'Failed to add chiwog' };
  }
}

// Dummy chiwogs data
const DUMMY_CHIWOGS = [
  {
    id: '1',
    name: 'Motithang',
    gewogId: '1',
    gewogName: 'Chang',
    dzongkhagName: 'Thimphu',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Jungshina',
    gewogId: '1',
    gewogName: 'Chang',
    dzongkhagName: 'Thimphu',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Zilukha',
    gewogId: '1',
    gewogName: 'Chang',
    dzongkhagName: 'Thimphu',
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Taba',
    gewogId: '2',
    gewogName: 'Dagala',
    dzongkhagName: 'Thimphu',
    isActive: true,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Babesa',
    gewogId: '3',
    gewogName: 'Genekha',
    dzongkhagName: 'Thimphu',
    isActive: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '6',
    name: 'Kawang',
    gewogId: '4',
    gewogName: 'Kawang',
    dzongkhagName: 'Thimphu',
    isActive: true,
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z'
  },
  {
    id: '7',
    name: 'Lingzhi',
    gewogId: '7',
    gewogName: 'Lingzhi',
    dzongkhagName: 'Thimphu',
    isActive: true,
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z'
  },
  {
    id: '8',
    name: 'Soe',
    gewogId: '8',
    gewogName: 'Soe',
    dzongkhagName: 'Thimphu',
    isActive: true,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: '9',
    name: 'Toepisa',
    gewogId: '9',
    gewogName: 'Toepisa',
    dzongkhagName: 'Thimphu',
    isActive: true,
    createdAt: '2024-01-09T00:00:00Z',
    updatedAt: '2024-01-09T00:00:00Z'
  },
  {
    id: '10',
    name: 'Shaba',
    gewogId: '16',
    gewogName: 'Shaba',
    dzongkhagName: 'Paro',
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '11',
    name: 'Tsento',
    gewogId: '18',
    gewogName: 'Tsento',
    dzongkhagName: 'Paro',
    isActive: true,
    createdAt: '2024-01-11T00:00:00Z',
    updatedAt: '2024-01-11T00:00:00Z'
  },
  {
    id: '12',
    name: 'Wangchang',
    gewogId: '19',
    gewogName: 'Wangchang',
    dzongkhagName: 'Paro',
    isActive: true,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    id: '13',
    name: 'Lamgong',
    gewogId: '14',
    gewogName: 'Lamgong',
    dzongkhagName: 'Paro',
    isActive: true,
    createdAt: '2024-01-13T00:00:00Z',
    updatedAt: '2024-01-13T00:00:00Z'
  },
  {
    id: '14',
    name: 'Hungrel',
    gewogId: '13',
    gewogName: 'Hungrel',
    dzongkhagName: 'Paro',
    isActive: true,
    createdAt: '2024-01-14T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z'
  },
  {
    id: '15',
    name: 'Dopshari',
    gewogId: '12',
    gewogName: 'Dopshari',
    dzongkhagName: 'Paro',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '16',
    name: 'Dogar',
    gewogId: '11',
    gewogName: 'Dogar',
    dzongkhagName: 'Paro',
    isActive: true,
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z'
  },
  {
    id: '17',
    name: 'Bajo',
    gewogId: '20',
    gewogName: 'Bajo',
    dzongkhagName: 'Punakha',
    isActive: true,
    createdAt: '2024-01-17T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z'
  },
  {
    id: '18',
    name: 'Gangtey',
    gewogId: '20',
    gewogName: 'Bajo',
    dzongkhagName: 'Punakha',
    isActive: true,
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  },
  {
    id: '19',
    name: 'Toedwang',
    gewogId: '20',
    gewogName: 'Bajo',
    dzongkhagName: 'Punakha',
    isActive: true,
    createdAt: '2024-01-19T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z'
  },
  {
    id: '20',
    name: 'Kabjisa',
    gewogId: '20',
    gewogName: 'Bajo',
    dzongkhagName: 'Punakha',
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  }
];

export async function getChiwogs({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getChiwogs called with dummy data:', { page, limit, search });

  try {
    // Filter chiwogs based on search query
    let filteredChiwogs = DUMMY_CHIWOGS;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredChiwogs = DUMMY_CHIWOGS.filter(
        (chiwog) =>
          chiwog.name.toLowerCase().includes(searchLower) ||
          chiwog.gewogName.toLowerCase().includes(searchLower) ||
          chiwog.dzongkhagName.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedChiwogs = filteredChiwogs.slice(startIndex, endIndex);

    return {
      page: currentPage,
      limit: pageSize,
      totalChiwogs: filteredChiwogs.length,
      chiwogs: paginatedChiwogs
    };
  } catch (error) {
    console.error('Error fetching chiwogs:', error);
    return {
      page: 0,
      limit: 0,
      totalChiwogs: 0,
      chiwogs: []
    };
  }
}

export async function getAllChiwogs() {
  try {
    const response = await fetch(`${API_URL}/chiwogs/all`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch chiwogs: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching chiwogs:', error);
  }
}

export async function getChiwogById(id: string) {
  try {
    const response = await fetch(`${API_URL}/chiwogs/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch chiwog: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching chiwog:', error);
    return {
      error: true,
      message: 'Failed to fetch chiwog'
    };
  }
}

export async function deleteChiwog(id?: string) {
  try {
    const response = await fetch(`${API_URL}/chiwogs/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete chiwog: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/chiwogs');
  } catch (error) {
    console.error('Error deleting chiwog:', error);
    return null;
  }
}

export async function updateChiwog(id: string, data: any) {
  const response = await fetch(`${API_URL}/chiwogs/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message || 'Failed to update chiwog';
    return { error: true, message: errorMessage };
  }

  revalidatePath('/dashboard/chiwogs');
  return res;
}
