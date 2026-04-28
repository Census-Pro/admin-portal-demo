'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createHohChangeReasons(formData: any) {
  try {
    const response = await fetch(`${API_URL}/hoh-change-reason`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add HOH change reason';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/hoh-change-reason');
    return data;
  } catch (error) {
    console.error('Error creating HOH change reason:', error);
    return { error: true, message: 'Failed to add HOH change reason' };
  }
}

export async function getHohChangeReasons({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  try {
    let url = `${API_URL}/hoh-change-reason?page=${page}&take=${limit}`;

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
        totalHohChangeReasons: 0,
        hohChangeReasons: []
      };
    }

    const data = await response.json();

    const hohChangeReasons = data.data || [];
    const meta = data.meta || { page: 0, take: 0, itemCount: 0 };

    return {
      page: meta.page,
      limit: meta.take,
      totalHohChangeReasons: meta.itemCount,
      hohChangeReasons
    };
  } catch (error) {
    console.error('Error fetching HOH change reasons:', error);
    return {
      page: 0,
      limit: 0,
      totalHohChangeReasons: 0,
      hohChangeReasons: []
    };
  }
}

export async function getAllHohChangeReasons() {
  try {
    const response = await fetch(`${API_URL}/hoh-change-reason`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch HOH change reasons: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching HOH change reasons:', error);
  }
}

export async function deleteHohChangeReason(id?: string) {
  try {
    const response = await fetch(`${API_URL}/hoh-change-reason/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete HOH change reason: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/hoh-change-reason');
    return { error: false, message: 'HOH Change Reason deleted successfully' };
  } catch (error) {
    console.error('Error deleting HOH change reason:', error);
    return { error: true, message: 'Failed to delete HOH change reason' };
  }
}

export async function updateHohChangeReason(id: string, data: any) {
  const response = await fetch(`${API_URL}/hoh-change-reason/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message ||
      'Failed to update HOH change reason';
    return { error: true, message: errorMessage };
  }

  revalidatePath('/dashboard/hoh-change-reason');
  return res;
}
