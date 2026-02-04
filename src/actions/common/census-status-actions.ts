'use server';

import { updateTag } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createCensusStatus(formData: any) {
  try {
    const response = await fetch(`${API_URL}/census-statuses`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add census status';
      return { error: true, message: errorMessage };
    }

    updateTag('census-status');
    return data;
  } catch (error) {
    console.error('Error creating census status:', error);
    return { error: true, message: 'Failed to add census status' };
  }
}

export async function getCensusStatuses({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  let url = `${API_URL}/census-statuses?page=${page}&take=${limit}`;
  try {
    // Search
    if (search) {
      url += `&q=${search}`;
    }

    const response = await fetch(url, {
      headers: await instance(),
      next: { tags: ['census-status'] }
    });

    if (!response.ok) {
      return {
        page: 0,
        limit: 0,
        totalCensusStatuses: 0,
        censusStatuses: []
      };
    }

    const data = await response.json();

    const censusStatuses = data.data || [];
    const meta = data.meta || { page: 0, take: 0, itemCount: 0 };

    return {
      page: meta.page,
      limit: meta.take,
      totalCensusStatuses: meta.itemCount,
      censusStatuses
    };
  } catch (error) {
    console.error('Error fetching census statuses:', error);
    return {
      page: 0,
      limit: 0,
      totalCensusStatuses: 0,
      censusStatuses: []
    };
  }
}

export async function getAllCensusStatuses() {
  try {
    const response = await fetch(`${API_URL}/census-statuses/all`, {
      headers: await instance(),
      next: { tags: ['census-status'] }
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch census statuses: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching census statuses:', error);
  }
}

export async function deleteCensusStatus(id?: string) {
  try {
    const response = await fetch(`${API_URL}/census-statuses/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete census status: ${response.statusText}`
      };
    }

    updateTag('census-status');
  } catch (error) {
    console.error('Error deleting census status:', error);
    return null;
  }
}

export async function updateCensusStatus(id: string, data: any) {
  const response = await fetch(`${API_URL}/census-statuses/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message ||
      'Failed to update census status';
    return { error: true, message: errorMessage };
  }

  updateTag('census-status');
  return res;
}
