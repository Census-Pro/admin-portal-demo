'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createVillages(formData: any) {
  try {
    const response = await fetch(`${API_URL}/villages`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message || 'Failed to add villages';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/villages');
    return data;
  } catch (error) {
    console.error('Error creating village:', error);
    return { error: true, message: 'Failed to add villages' };
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
      return {
        error: true,
        message: `Failed to fetch villages: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching villages:', error);
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
  const response = await fetch(`${API_URL}/villages/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message || 'Failed to update village';
    return { error: true, message: errorMessage };
  }

  revalidatePath('/dashboard/villages');
  return res;
}
