'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createFineType(formData: any) {
  try {
    console.log('Creating fine type with data:', formData);
    const response = await fetch(`${API_URL}/fine-types`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();
    console.log('Create fine type response:', {
      status: response.status,
      data
    });

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        data?.message ||
        (Array.isArray(data?.message) ? data.message.join(', ') : null) ||
        'Failed to add fine type';
      console.error('Error creating fine type:', errorMessage, data);
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/fine-types');
    return data;
  } catch (error) {
    console.error('Error creating fine type:', error);
    return { error: true, message: 'Failed to add fine type' };
  }
}

export async function getFineTypes({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  try {
    console.log('Fetching all fine types from /all endpoint');
    const response = await fetch(`${API_URL}/fine-types/all`, {
      headers: await instance(),
      cache: 'no-store'
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      console.error(
        'Response not OK:',
        response.status,
        response.statusText,
        errorData
      );

      if (errorData?.message && Array.isArray(errorData.message)) {
        console.error('Validation errors:', errorData.message);
      }

      return {
        page: 0,
        limit: 0,
        totalFineTypes: 0,
        fineTypes: []
      };
    }

    const data = await response.json();
    console.log('API Response data:', data);

    // For /all endpoint, data might be directly an array or in data.data
    const fineTypes = Array.isArray(data) ? data : data.data || [];

    console.log('Parsed data:', {
      totalFineTypes: fineTypes.length,
      fineTypes
    });

    return {
      page: 1,
      limit: fineTypes.length,
      totalFineTypes: fineTypes.length,
      fineTypes
    };
  } catch (error) {
    console.error('Error fetching fine types:', error);
    return {
      page: 0,
      limit: 0,
      totalFineTypes: 0,
      fineTypes: []
    };
  }
}

export async function getAllFineTypes() {
  try {
    const response = await fetch(`${API_URL}/fine-types/all`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch fine types: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching fine types:', error);
  }
}

export async function getSimpleFineTypes() {
  try {
    const response = await fetch(`${API_URL}/fine-types/simple`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch simple fine types: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching simple fine types:', error);
    return {
      error: true,
      message: 'Failed to fetch simple fine types'
    };
  }
}

export async function getFineTypeById(id: string) {
  try {
    const response = await fetch(`${API_URL}/fine-types/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch fine type: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching fine type:', error);
    return {
      error: true,
      message: 'Failed to fetch fine type'
    };
  }
}

export async function deleteFineType(id?: string) {
  try {
    const response = await fetch(`${API_URL}/fine-types/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete fine type: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/fine-types');
    return {
      error: false,
      message: 'Fine type deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting fine type:', error);
    return { error: true, message: 'Failed to delete fine type' };
  }
}

export async function updateFineType(id: string, data: any) {
  try {
    const response = await fetch(`${API_URL}/fine-types/${id}`, {
      method: 'PATCH',
      headers: await instance(),
      body: JSON.stringify(data)
    });

    const res = await response.json();

    if (!response.ok || res?.error) {
      const errorMessage =
        (res?.error as ApiErrorResponse)?.message ||
        'Failed to update fine type';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/fine-types');
    return res;
  } catch (error) {
    console.error('Error updating fine type:', error);
    return { error: true, message: 'Failed to update fine type' };
  }
}
