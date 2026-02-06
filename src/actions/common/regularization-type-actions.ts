'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createRegularizationType(formData: any) {
  try {
    const response = await fetch(`${API_URL}/regularization-types`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add regularization type';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/(masters)/regularization-types');
    return data;
  } catch (error) {
    console.error('Error creating regularization type:', error);
    return { error: true, message: 'Failed to add regularization type' };
  }
}

export async function getRegularizationTypes({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  let url = `${API_URL}/regularization-types?page=${page}&take=${limit}`;
  try {
    if (search) {
      url += `&q=${search}`;
    }

    const response = await fetch(url, {
      headers: await instance(),
      next: { tags: ['regularization-types'] }
    });

    if (!response.ok) {
      return {
        page: 0,
        limit: 0,
        totalItems: 0,
        data: []
      };
    }

    const data = await response.json();

    const regularizationTypes = data.data || [];
    const meta = data.meta || { page: 0, take: 0, itemCount: 0 };

    return {
      page: meta.page,
      limit: meta.take,
      totalItems: meta.itemCount,
      data: regularizationTypes
    };
  } catch (error) {
    console.error('Error fetching regularization types:', error);
    return {
      page: 0,
      limit: 0,
      totalItems: 0,
      data: []
    };
  }
}

export async function getAllRegularizationTypes() {
  try {
    const response = await fetch(`${API_URL}/regularization-types/all`, {
      headers: await instance(),
      next: { tags: ['regularization-types'] }
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch regularization types: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching regularization types:', error);
  }
}

export async function deleteRegularizationType(id?: string) {
  try {
    const response = await fetch(`${API_URL}/regularization-types/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete regularization type: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/(masters)/regularization-types');
    return {
      error: false,
      message: 'Regularization type deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting regularization type:', error);
    return { error: true, message: 'Failed to delete regularization type' };
  }
}
export async function updateRegularizationType(id: string, data: any) {
  const response = await fetch(`${API_URL}/regularization-types/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message ||
      'Failed to update regularization type';
    return { error: true, message: errorMessage };
  }

  revalidatePath('/dashboard/(masters)/regularization-types');
  return res;
}
