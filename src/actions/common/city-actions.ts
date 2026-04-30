'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createCities(formData: any) {
  try {
    const response = await fetch(`${API_URL}/cities`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message || 'Failed to add cities';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/cities');
    return data;
  } catch (error) {
    console.error('Error creating city:', error);
    return { error: true, message: 'Failed to add cities' };
  }
}

// Dummy cities data
const DUMMY_CITIES = [
  {
    id: '1',
    name: 'Thimphu City',
    dzongkhagId: '1',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '2',
    name: 'Phuentsholing',
    dzongkhagId: '5',
    dzongkhagName: 'Chukha',
    isActive: true
  },
  {
    id: '3',
    name: 'Gelephu',
    dzongkhagId: '12',
    dzongkhagName: 'Sarpang',
    isActive: true
  },
  {
    id: '4',
    name: 'Samdrup Jongkhar',
    dzongkhagId: '7',
    dzongkhagName: 'Samdrup Jongkhar',
    isActive: true
  },
  {
    id: '5',
    name: 'Trashigang',
    dzongkhagId: '7',
    dzongkhagName: 'Trashigang',
    isActive: true
  },
  {
    id: '6',
    name: 'Mongar',
    dzongkhagId: '6',
    dzongkhagName: 'Mongar',
    isActive: true
  },
  {
    id: '7',
    name: 'Punakha',
    dzongkhagId: '3',
    dzongkhagName: 'Punakha',
    isActive: true
  },
  {
    id: '8',
    name: 'Paro',
    dzongkhagId: '2',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '9',
    name: 'Wangdue Phodrang',
    dzongkhagId: '4',
    dzongkhagName: 'Wangdue Phodrang',
    isActive: true
  },
  {
    id: '10',
    name: 'Trongsa',
    dzongkhagId: '18',
    dzongkhagName: 'Trongsa',
    isActive: true
  },
  {
    id: '11',
    name: 'Bumthang',
    dzongkhagId: '17',
    dzongkhagName: 'Bumthang',
    isActive: true
  },
  {
    id: '12',
    name: 'Lhuentse',
    dzongkhagId: '5',
    dzongkhagName: 'Lhuentse',
    isActive: true
  },
  {
    id: '13',
    name: 'Zhemgang',
    dzongkhagId: '11',
    dzongkhagName: 'Zhemgang',
    isActive: true
  },
  {
    id: '14',
    name: 'Sarpang',
    dzongkhagId: '12',
    dzongkhagName: 'Sarpang',
    isActive: true
  },
  {
    id: '15',
    name: 'Samtse',
    dzongkhagId: '13',
    dzongkhagName: 'Samtse',
    isActive: true
  }
];

export async function getCities({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getCities called with dummy data:', { page, limit, search });

  try {
    // Filter cities based on search query
    let filteredCities = DUMMY_CITIES;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredCities = DUMMY_CITIES.filter(
        (city) =>
          city.name.toLowerCase().includes(searchLower) ||
          city.dzongkhagName.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCities = filteredCities.slice(startIndex, endIndex);

    return {
      page: currentPage,
      limit: pageSize,
      totalCities: filteredCities.length,
      cities: paginatedCities
    };
  } catch (error) {
    console.error('Error fetching cities:', error);
    return {
      page: 0,
      limit: 0,
      totalCities: 0,
      cities: []
    };
  }
}

export async function getCityById(id: string) {
  try {
    const response = await fetch(`${API_URL}/cities/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch city: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching city:', error);
    return { error: true, message: 'Failed to fetch city' };
  }
}

export async function getAllCities() {
  try {
    const response = await fetch(`${API_URL}/cities/all`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch cities: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching cities:', error);
  }
}

export async function deleteCity(id?: string) {
  try {
    const response = await fetch(`${API_URL}/cities/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete city: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/cities');
  } catch (error) {
    console.error('Error deleting city:', error);
    return null;
  }
}

export async function updateCity(id: string, data: any) {
  const response = await fetch(`${API_URL}/cities/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message || 'Failed to update city';
    return { error: true, message: errorMessage };
  }

  revalidatePath('/dashboard/cities');
  return res;
}
