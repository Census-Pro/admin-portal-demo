'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createMajorThromde(formData: any) {
  try {
    const response = await fetch(`${API_URL}/major-thromdes`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add major thromde';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/major-thromdes');
    return data;
  } catch (error) {
    console.error('Error creating major thromde:', error);
    return { error: true, message: 'Failed to add major thromde' };
  }
}

export async function getMajorThromdes({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  let url = `${API_URL}/major-thromdes/search/query?page=${page}&take=${limit}`;
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
        totalMajorThromdes: 0,
        majorThromdes: []
      };
    }

    const data = await response.json();

    const majorThromdes = data.data || [];
    const meta = data.meta || { page: 0, take: 0, itemCount: 0 };

    return {
      page: meta.page,
      limit: meta.take,
      totalMajorThromdes: meta.itemCount,
      majorThromdes
    };
  } catch (error) {
    console.error('Error fetching major thromdes:', error);
    return {
      page: 0,
      limit: 0,
      totalMajorThromdes: 0,
      majorThromdes: []
    };
  }
}

export async function getAllMajorThromdes() {
  try {
    const response = await fetch(`${API_URL}/major-thromdes`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch major thromdes: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching major thromdes:', error);
  }
}

export async function getMajorThromdeById(id: string) {
  try {
    const response = await fetch(`${API_URL}/major-thromdes/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch major thromde: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching major thromde:', error);
    return {
      error: true,
      message: 'Failed to fetch major thromde'
    };
  }
}

export async function getMajorThromdeByName(thromdeName: string) {
  try {
    const response = await fetch(
      `${API_URL}/major-thromdes/search/name/${encodeURIComponent(thromdeName)}`,
      {
        headers: await instance(),
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch major thromde: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching major thromde by name:', error);
    return {
      error: true,
      message: 'Failed to fetch major thromde'
    };
  }
}

export async function deleteMajorThromde(id?: string) {
  try {
    const response = await fetch(`${API_URL}/major-thromdes/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete major thromde: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/major-thromdes');
    return { error: false, message: 'Major thromde deleted successfully' };
  } catch (error) {
    console.error('Error deleting major thromde:', error);
    return { error: true, message: 'Failed to delete major thromde' };
  }
}

export async function updateMajorThromde(id: string, data: any) {
  try {
    const response = await fetch(`${API_URL}/major-thromdes/${id}`, {
      method: 'PATCH',
      headers: await instance(),
      body: JSON.stringify(data)
    });

    const res = await response.json();

    if (!response.ok || res?.error) {
      const errorMessage =
        (res?.error as ApiErrorResponse)?.message ||
        'Failed to update major thromde';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/major-thromdes');
    return res;
  } catch (error) {
    console.error('Error updating major thromde:', error);
    return { error: true, message: 'Failed to update major thromde' };
  }
}
