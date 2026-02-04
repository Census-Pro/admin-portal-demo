'use server';

import { updateTag } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createMaritalStatus(formData: any) {
  try {
    const response = await fetch(`${API_URL}/marital-statuses`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add marital status';
      return { error: true, message: errorMessage };
    }

    updateTag('marital-status');
    return data;
  } catch (error) {
    console.error('Error creating marital status:', error);
    return { error: true, message: 'Failed to add marital status' };
  }
}

export async function getMaritalStatuses({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  let url = `${API_URL}/marital-statuses?page=${page}&take=${limit}`;
  try {
    // Search
    if (search) {
      url += `&q=${search}`;
    }

    const response = await fetch(url, {
      headers: await instance(),
      next: { tags: ['marital-status'] }
    });

    if (!response.ok) {
      return {
        page: 0,
        limit: 0,
        totalMaritalStatuses: 0,
        maritalStatuses: []
      };
    }

    const data = await response.json();

    const maritalStatuses = data.data || [];
    const meta = data.meta || { page: 0, take: 0, itemCount: 0 };

    return {
      page: meta.page,
      limit: meta.take,
      totalMaritalStatuses: meta.itemCount,
      maritalStatuses
    };
  } catch (error) {
    console.error('Error fetching marital statuses:', error);
    return {
      page: 0,
      limit: 0,
      totalMaritalStatuses: 0,
      maritalStatuses: []
    };
  }
}

export async function getAllMaritalStatuses() {
  try {
    const response = await fetch(`${API_URL}/marital-statuses/all`, {
      headers: await instance(),
      next: { tags: ['marital-status'] }
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch marital statuses: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching marital statuses:', error);
  }
}

export async function deleteMaritalStatus(id?: string) {
  try {
    const response = await fetch(`${API_URL}/marital-statuses/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete marital status: ${response.statusText}`
      };
    }

    updateTag('marital-status');
  } catch (error) {
    console.error('Error deleting marital status:', error);
    return null;
  }
}

export async function updateMaritalStatus(id: string, data: any) {
  const response = await fetch(`${API_URL}/marital-statuses/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message ||
      'Failed to update marital status';
    return { error: true, message: errorMessage };
  }

  updateTag('marital-status');
  return res;
}
