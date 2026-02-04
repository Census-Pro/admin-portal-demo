'use server';

import { updateTag } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createNaturalizationType(formData: any) {
  try {
    const response = await fetch(`${API_URL}/naturalization-types`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add naturalization type';
      return { error: true, message: errorMessage };
    }

    updateTag('naturalization-types');
    return data;
  } catch (error) {
    console.error('Error creating naturalization type:', error);
    return { error: true, message: 'Failed to add naturalization type' };
  }
}

export async function getNaturalizationTypes({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  let url = `${API_URL}/naturalization-types?page=${page}&take=${limit}`;
  try {
    if (search) {
      url += `&q=${search}`;
    }

    const response = await fetch(url, {
      headers: await instance(),
      next: { tags: ['naturalization-types'] }
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

    const naturalizationTypes = data.data || [];
    const meta = data.meta || { page: 0, take: 0, itemCount: 0 };

    return {
      page: meta.page,
      limit: meta.take,
      totalItems: meta.itemCount,
      data: naturalizationTypes
    };
  } catch (error) {
    console.error('Error fetching naturalization types:', error);
    return {
      page: 0,
      limit: 0,
      totalItems: 0,
      data: []
    };
  }
}

export async function getAllNaturalizationTypes() {
  try {
    const response = await fetch(`${API_URL}/naturalization-types/all`, {
      headers: await instance(),
      next: { tags: ['naturalization-types'] }
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch naturalization types: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching naturalization types:', error);
  }
}

export async function deleteNaturalizationType(id?: string) {
  try {
    const response = await fetch(`${API_URL}/naturalization-types/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete naturalization type: ${response.statusText}`
      };
    }

    updateTag('naturalization-types');
  } catch (error) {
    console.error('Error deleting naturalization type:', error);
    return null;
  }
}

export async function updateNaturalizationType(id: string, data: any) {
  const response = await fetch(`${API_URL}/naturalization-types/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message ||
      'Failed to update naturalization type';
    return { error: true, message: errorMessage };
  }

  updateTag('naturalization-types');
  return res;
}
