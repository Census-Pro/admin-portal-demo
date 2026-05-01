'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createVillages(formData: any) {
  try {
    console.log('Creating village with data:', formData);

    const response = await fetch(`${API_URL}/villages`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    console.log('API Response:', { status: response.status, data });

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        data?.message ||
        `Failed to add village (Status: ${response.status})`;
      console.error('API Error:', errorMessage, data);
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/villages');
    return data;
  } catch (error) {
    console.error('Error creating village:', error);
    return {
      error: true,
      message: 'Failed to add villages. Please check the console for details.'
    };
  }
}

// Dummy villages data
const DUMMY_VILLAGES = [
  {
    id: '1',
    name: 'Motithang Lower',
    chiwogId: '1',
    chiwogName: 'Motithang',
    gewogName: 'Chang',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '2',
    name: 'Motithang Upper',
    chiwogId: '1',
    chiwogName: 'Motithang',
    gewogName: 'Chang',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '3',
    name: 'Jungshina',
    chiwogId: '2',
    chiwogName: 'Jungshina',
    gewogName: 'Chang',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '4',
    name: 'Zilukha',
    chiwogId: '3',
    chiwogName: 'Zilukha',
    gewogName: 'Chang',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '5',
    name: 'Taba',
    chiwogId: '4',
    chiwogName: 'Taba',
    gewogName: 'Dagala',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '6',
    name: 'Babesa',
    chiwogId: '5',
    chiwogName: 'Babesa',
    gewogName: 'Genekha',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '7',
    name: 'Kawang',
    chiwogId: '6',
    chiwogName: 'Kawang',
    gewogName: 'Kawang',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '8',
    name: 'Shaba',
    chiwogId: '10',
    chiwogName: 'Shaba',
    gewogName: 'Shaba',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '9',
    name: 'Tsento',
    chiwogId: '11',
    chiwogName: 'Tsento',
    gewogName: 'Tsento',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '10',
    name: 'Wangchang',
    chiwogId: '12',
    chiwogName: 'Wangchang',
    gewogName: 'Wangchang',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '11',
    name: 'Lamgong',
    chiwogId: '13',
    chiwogName: 'Lamgong',
    gewogName: 'Lamgong',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '12',
    name: 'Hungrel',
    chiwogId: '14',
    chiwogName: 'Hungrel',
    gewogName: 'Hungrel',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '13',
    name: 'Dopshari',
    chiwogId: '15',
    chiwogName: 'Dopshari',
    gewogName: 'Dopshari',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '14',
    name: 'Dogar',
    chiwogId: '16',
    chiwogName: 'Dogar',
    gewogName: 'Dogar',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '15',
    name: 'Bajo',
    chiwogId: '17',
    chiwogName: 'Bajo',
    gewogName: 'Bajo',
    dzongkhagName: 'Punakha',
    isActive: true
  },
  {
    id: '16',
    name: 'Gangtey',
    chiwogId: '18',
    chiwogName: 'Gangtey',
    gewogName: 'Bajo',
    dzongkhagName: 'Punakha',
    isActive: true
  },
  {
    id: '17',
    name: 'Toedwang',
    chiwogId: '19',
    chiwogName: 'Toedwang',
    gewogName: 'Bajo',
    dzongkhagName: 'Punakha',
    isActive: true
  },
  {
    id: '18',
    name: 'Kabjisa',
    chiwogId: '20',
    chiwogName: 'Kabjisa',
    gewogName: 'Bajo',
    dzongkhagName: 'Punakha',
    isActive: true
  },
  {
    id: '19',
    name: 'Lingzhi',
    chiwogId: '7',
    chiwogName: 'Lingzhi',
    gewogName: 'Lingzhi',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '20',
    name: 'Soe',
    chiwogId: '8',
    chiwogName: 'Soe',
    gewogName: 'Soe',
    dzongkhagName: 'Thimphu',
    isActive: true
  },
  {
    id: '12',
    name: 'Bondey',
    chiwogId: '10',
    chiwogName: 'Shaba',
    gewogName: 'Shaba',
    dzongkhagName: 'Paro',
    isActive: true
  },
  {
    id: '25',
    name: 'Talo',
    chiwogId: '21',
    chiwogName: 'Guma',
    gewogName: 'Guma',
    dzongkhagName: 'Punakha',
    isActive: true
  },
  {
    id: '34',
    name: 'Gasetsho',
    chiwogId: '22',
    chiwogName: 'Athang',
    gewogName: 'Athang',
    dzongkhagName: 'Wangdue Phodrang',
    isActive: true
  },
  {
    id: '42',
    name: 'Jakar',
    chiwogId: '23',
    chiwogName: 'Chhoekhor',
    gewogName: 'Chhoekhor',
    dzongkhagName: 'Bumthang',
    isActive: true
  },
  {
    id: '51',
    name: 'Yonphu',
    chiwogId: '24',
    chiwogName: 'Kanglung',
    gewogName: 'Kanglung',
    dzongkhagName: 'Trashigang',
    isActive: true
  },
  {
    id: '60',
    name: 'Samtse Town',
    chiwogId: '25',
    chiwogName: 'Samtse',
    gewogName: 'Samtse',
    dzongkhagName: 'Samtse',
    isActive: true
  },
  {
    id: '68',
    name: 'Mongar Town',
    chiwogId: '26',
    chiwogName: 'Mongar',
    gewogName: 'Mongar',
    dzongkhagName: 'Mongar',
    isActive: true
  }
];

export async function getVillages({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getVillages called with dummy data:', { page, limit, search });

  try {
    // Filter villages based on search query
    let filteredVillages = DUMMY_VILLAGES;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredVillages = DUMMY_VILLAGES.filter(
        (village) =>
          village.name.toLowerCase().includes(searchLower) ||
          village.chiwogName.toLowerCase().includes(searchLower) ||
          village.gewogName.toLowerCase().includes(searchLower) ||
          village.dzongkhagName.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedVillages = filteredVillages.slice(startIndex, endIndex);

    return {
      page: currentPage,
      limit: pageSize,
      totalVillages: filteredVillages.length,
      villages: paginatedVillages
    };
  } catch (error) {
    console.error('Error fetching villages:', error);
    return {
      page: 0,
      limit: 0,
      totalVillages: 0,
      villages: []
    };
  }
}

export async function getAllVillages() {
  try {
    const response = await fetch(`${API_URL}/villages/all`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Failed to fetch villages:', response.statusText);
      return {
        error: true,
        message: `Failed to fetch villages: ${response.statusText}`,
        data: []
      };
    }

    const data = await response.json();
    const villagesData = Array.isArray(data) ? data : data.data || data;

    return { data: villagesData, error: false };
  } catch (error) {
    console.error('Error fetching villages:', error);
    return {
      error: true,
      message: 'Failed to fetch villages',
      data: []
    };
  }
}

export async function getVillageById(id: string) {
  // Demo: Return dummy data
  const village = DUMMY_VILLAGES.find((v) => v.id === id);
  if (village) {
    return village;
  }
  return {
    error: true,
    message: 'Village not found'
  };
}

export async function deleteVillage(id?: string) {
  try {
    const response = await fetch(`${API_URL}/villages/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete village: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/villages');
    return { success: true };
  } catch (error) {
    console.error('Error deleting village:', error);
    return { error: true, message: 'Failed to delete village' };
  }
}

export async function updateVillage(id: string, data: any) {
  try {
    console.log('Updating village:', id, 'with data:', data);

    const response = await fetch(`${API_URL}/villages/${id}`, {
      method: 'PATCH',
      headers: await instance(),
      body: JSON.stringify(data)
    });

    const res = await response.json();

    console.log('Update Response:', { status: response.status, data: res });

    if (!response.ok || res?.error) {
      const errorMessage =
        (res?.error as ApiErrorResponse)?.message ||
        res?.message ||
        `Failed to update village (Status: ${response.status})`;
      console.error('Update API Error:', errorMessage, res);
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/villages');
    return res;
  } catch (error) {
    console.error('Error updating village:', error);
    return {
      error: true,
      message: 'Failed to update village. Please check the console for details.'
    };
  }
}
