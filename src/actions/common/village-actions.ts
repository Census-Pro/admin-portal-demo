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

export async function getVillages({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  let url = `${API_URL}/villages?page=${page}&take=${limit}`;
  try {
    // Search
    if (search) {
      url += `&q=${search}`;
    }

    const response = await fetch(url, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        page: 0,
        limit: 0,
        totalVillages: 0,
        villages: []
      };
    }

    const data = await response.json();

    const villages = data.data || [];
    const meta = data.meta || { page: 0, take: 0, itemCount: 0 };

    return {
      page: meta.page,
      limit: meta.take,
      totalVillages: meta.itemCount,
      villages
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
  try {
    const response = await fetch(`${API_URL}/villages/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch village: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching village:', error);
    return {
      error: true,
      message: 'Failed to fetch village'
    };
  }
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
