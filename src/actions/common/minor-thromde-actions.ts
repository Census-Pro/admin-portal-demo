'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createMinorThromde(formData: any) {
  try {
    console.log('Creating minor thromde with payload:', formData);
    console.log('API URL:', `${API_URL}/minor-thromdes`);

    const response = await fetch(`${API_URL}/minor-thromdes`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      return {
        error: true,
        message: `Server error (Status: ${response.status}). Failed to parse response.`
      };
    }

    console.log('API Response:', { status: response.status, data });

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        data?.message ||
        (Array.isArray(data?.message) ? data.message.join(', ') : '') ||
        `Failed to add minor thromde (Status: ${response.status})`;
      console.error('API Error Details:', { status: response.status, data });
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/minor-thromdes');
    return data;
  } catch (error) {
    console.error('Error creating minor thromde:', error);
    return { error: true, message: `Failed to add minor thromde: ${error}` };
  }
}

export async function getMinorThromdes({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  let url = `${API_URL}/minor-thromdes?page=${page}&take=${limit}`;
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
        totalMinorThromdes: 0,
        minorThromdes: []
      };
    }

    const data = await response.json();

    const minorThromdes = data.data || [];
    const meta = data.meta || { page: 0, take: 0, itemCount: 0 };

    return {
      page: meta.page,
      limit: meta.take,
      totalMinorThromdes: meta.itemCount,
      minorThromdes
    };
  } catch (error) {
    console.error('Error fetching minor thromdes:', error);
    return {
      page: 0,
      limit: 0,
      totalMinorThromdes: 0,
      minorThromdes: []
    };
  }
}

export async function getAllMinorThromdes() {
  try {
    const response = await fetch(`${API_URL}/minor-thromdes/all`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch minor thromdes: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching minor thromdes:', error);
  }
}

export async function getMinorThromdeById(id: string) {
  try {
    const response = await fetch(`${API_URL}/minor-thromdes/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch minor thromde: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching minor thromde:', error);
    return {
      error: true,
      message: 'Failed to fetch minor thromde'
    };
  }
}

export async function getDzongkhagByThromdeName(thromdeName: string) {
  try {
    const response = await fetch(
      `${API_URL}/minor-thromdes/dzongkhag/${encodeURIComponent(thromdeName)}`,
      {
        headers: await instance(),
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch dzongkhag: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching dzongkhag by thromde name:', error);
    return {
      error: true,
      message: 'Failed to fetch dzongkhag'
    };
  }
}

export async function deleteMinorThromde(id?: string) {
  try {
    const response = await fetch(`${API_URL}/minor-thromdes/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete minor thromde: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/minor-thromdes');
    return { error: false, message: 'Minor thromde deleted successfully' };
  } catch (error) {
    console.error('Error deleting minor thromde:', error);
    return { error: true, message: 'Failed to delete minor thromde' };
  }
}

export async function updateMinorThromde(id: string, data: any) {
  try {
    const response = await fetch(`${API_URL}/minor-thromdes/${id}`, {
      method: 'PATCH',
      headers: await instance(),
      body: JSON.stringify(data)
    });

    const res = await response.json();

    if (!response.ok || res?.error) {
      const errorMessage =
        (res?.error as ApiErrorResponse)?.message ||
        'Failed to update minor thromde';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/minor-thromdes');
    return res;
  } catch (error) {
    console.error('Error updating minor thromde:', error);
    return { error: true, message: 'Failed to update minor thromde' };
  }
}
