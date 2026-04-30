'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createMajorThromde(formData: any) {
  try {
    const response = await fetch(`${API_URL}/major-thromdes`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add major thromde';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/major-thromdes');
    return data;
  } catch (error) {
    console.error('Error creating major thromde:', error);
    return { error: true, message: 'Failed to add major thromde' };
  }
}

// Dummy major thromdes data
const DUMMY_MAJOR_THROMDES = [
  {
    id: '1',
    name: 'Thimphu Thromde',
    dzongkhagId: '1',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '2',
    name: 'Phuentsholing Thromde',
    dzongkhagId: '14',
    dzongkhagName: 'Chukha',
    isActive: true
  },
  {
    id: '3',
    name: 'Gelephu Thromde',
    dzongkhagId: '12',
    dzongkhagName: 'Sarpang',
    isActive: true
  },
  {
    id: '4',
    name: 'Samdrup Jongkhar Thromde',
    dzongkhagId: '7',
    dzongkhagName: 'Samdrup Jongkhar',
    isActive: true
  },
  {
    id: '5',
    name: 'Trashigang Thromde',
    dzongkhagId: '7',
    dzongkhagName: 'Trashigang',
    isActive: true
  },
  {
    id: '6',
    name: 'Mongar Thromde',
    dzongkhagId: '6',
    dzongkhagName: 'Mongar',
    isActive: true
  },
  {
    id: '7',
    name: 'Punakha Thromde',
    dzongkhagId: '3',
    dzongkhagName: 'Punakha',
    isActive: true
  },
  {
    id: '8',
    name: 'Paro Thromde',
    dzongkhagId: '2',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '9',
    name: 'Wangdue Phodrang Thromde',
    dzongkhagId: '4',
    dzongkhagName: 'Wangdue Phodrang',
    isActive: true
  },
  {
    id: '10',
    name: 'Trongsa Thromde',
    dzongkhagId: '18',
    dzongkhagName: 'Trongsa',
    isActive: true
  }
];

export async function getMajorThromdes({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getMajorThromdes called with dummy data:', {
    page,
    limit,
    search
  });

  try {
    // Filter major thromdes based on search query
    let filteredMajorThromdes = DUMMY_MAJOR_THROMDES;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredMajorThromdes = DUMMY_MAJOR_THROMDES.filter(
        (thromde) =>
          thromde.name.toLowerCase().includes(searchLower) ||
          thromde.dzongkhagName.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedMajorThromdes = filteredMajorThromdes.slice(
      startIndex,
      endIndex
    );

    return {
      page: currentPage,
      limit: pageSize,
      totalMajorThromdes: filteredMajorThromdes.length,
      majorThromdes: paginatedMajorThromdes
    };
  } catch (error) {
    console.error('Error fetching major thromdes:', error);
    return {
      page: 0,
      limit: 0,
      totalMajorThromdes: 0,
      majorThromdes: []
    };
  }
}

export async function getAllMajorThromdes() {
  try {
    const response = await fetch(`${API_URL}/major-thromdes`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch major thromdes: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching major thromdes:', error);
  }
}

export async function getMajorThromdeById(id: string) {
  try {
    const response = await fetch(`${API_URL}/major-thromdes/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch major thromde: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching major thromde:', error);
    return {
      error: true,
      message: 'Failed to fetch major thromde'
    };
  }
}

export async function getMajorThromdeByName(thromdeName: string) {
  try {
    const response = await fetch(
      `${API_URL}/major-thromdes/search/name/${encodeURIComponent(thromdeName)}`,
      {
        headers: await instance(),
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch major thromde: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching major thromde by name:', error);
    return {
      error: true,
      message: 'Failed to fetch major thromde'
    };
  }
}

export async function deleteMajorThromde(id?: string) {
  try {
    const response = await fetch(`${API_URL}/major-thromdes/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete major thromde: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/major-thromdes');
    return { error: false, message: 'Major thromde deleted successfully' };
  } catch (error) {
    console.error('Error deleting major thromde:', error);
    return { error: true, message: 'Failed to delete major thromde' };
  }
}

export async function updateMajorThromde(id: string, data: any) {
  try {
    const response = await fetch(`${API_URL}/major-thromdes/${id}`, {
      method: 'PATCH',
      headers: await instance(),
      body: JSON.stringify(data)
    });

    const res = await response.json();

    if (!response.ok || res?.error) {
      const errorMessage =
        (res?.error as ApiErrorResponse)?.message ||
        'Failed to update major thromde';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/major-thromdes');
    return res;
  } catch (error) {
    console.error('Error updating major thromde:', error);
    return { error: true, message: 'Failed to update major thromde' };
  }
}
