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

export async function getChiwogs({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  let url = `${API_URL}/chiwogs?page=${page}&take=${limit}`;
  try {
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
        totalChiwogs: 0,
        chiwogs: []
      };
    }

    const data = await response.json();

    const chiwogs = data.data || [];
    const meta = data.meta || { page: 0, take: 0, itemCount: 0 };

    return {
      page: meta.page,
      limit: meta.take,
      totalChiwogs: meta.itemCount,
      chiwogs
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
