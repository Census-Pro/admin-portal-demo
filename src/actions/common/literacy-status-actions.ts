'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createLiteracyStatus(formData: any) {
  try {
    const response = await fetch(`${API_URL}/literacy-statuses`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add literacy status';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/(masters)/literacy-status');
    return data;
  } catch (error) {
    console.error('Error creating literacy status:', error);
    return { error: true, message: 'Failed to add literacy status' };
  }
}

export async function getLiteracyStatuses({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  let url = `${API_URL}/literacy-statuses?page=${page}&take=${limit}`;
  try {
    // Search
    if (search) {
      url += `&q=${search}`;
    }

    const response = await fetch(url, {
      headers: await instance(),
      next: { tags: ['literacy-status'] }
    });

    if (!response.ok) {
      return {
        page: 0,
        limit: 0,
        totalLiteracyStatuses: 0,
        literacyStatuses: []
      };
    }

    const data = await response.json();

    const literacyStatuses = data.data || [];
    const meta = data.meta || { page: 0, take: 0, itemCount: 0 };

    return {
      page: meta.page,
      limit: meta.take,
      totalLiteracyStatuses: meta.itemCount,
      literacyStatuses
    };
  } catch (error) {
    console.error('Error fetching literacy statuses:', error);
    return {
      page: 0,
      limit: 0,
      totalLiteracyStatuses: 0,
      literacyStatuses: []
    };
  }
}

export async function getAllLiteracyStatuses() {
  try {
    const response = await fetch(`${API_URL}/literacy-statuses/all`, {
      headers: await instance(),
      next: { tags: ['literacy-status'] }
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch literacy statuses: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching literacy statuses:', error);
  }
}

export async function deleteLiteracyStatus(id?: string) {
  try {
    const response = await fetch(`${API_URL}/literacy-statuses/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete literacy status: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/(masters)/literacy-status');
    return { error: false, message: 'Literacy status deleted successfully' };
  } catch (error) {
    console.error('Error deleting literacy status:', error);
    return { error: true, message: 'Failed to delete literacy status' };
  }
}

export async function updateLiteracyStatus(id: string, data: any) {
  const response = await fetch(`${API_URL}/literacy-statuses/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message ||
      'Failed to update literacy status';
    return { error: true, message: errorMessage };
  }

  revalidatePath('/dashboard/(masters)/literacy-status');
  return res;
}
