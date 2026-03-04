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

export async function getGewogs({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  let url = `${API_URL}/gewogs?page=${page}&take=${limit}`;
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
        totalGewogs: 0,
        gewogs: []
      };
    }

    const data = await response.json();

    const gewogs = data.data || [];
    const meta = data.meta || { page: 0, take: 0, itemCount: 0 };

    return {
      page: meta.page,
      limit: meta.take,
      totalGewogs: meta.itemCount,
      gewogs
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
  try {
    const response = await fetch(`${API_URL}/gewogs/all`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch gewogs: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching gewogs:', error);
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
