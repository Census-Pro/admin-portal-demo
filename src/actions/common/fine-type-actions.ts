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

// Dummy fine types data
const DUMMY_FINE_TYPES = [
  { id: '1', name: 'Traffic Violation', isActive: true },
  { id: '2', name: 'Parking Violation', isActive: true },
  { id: '3', name: 'Public Nuisance', isActive: true },
  { id: '4', name: 'Environmental Violation', isActive: true },
  { id: '5', name: 'Building Code Violation', isActive: true },
  { id: '6', name: 'Business License Violation', isActive: true },
  { id: '7', name: 'Health Code Violation', isActive: true },
  { id: '8', name: 'Fire Safety Violation', isActive: true },
  { id: '9', name: 'Noise Violation', isActive: true },
  { id: '10', name: 'Waste Management Violation', isActive: true },
  { id: '11', name: 'Water Supply Violation', isActive: true },
  { id: '12', name: 'Electrical Code Violation', isActive: true }
];

export async function getFineTypes({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getFineTypes called with dummy data:', { page, limit, search });

  try {
    // Filter fine types based on search query
    let filteredFineTypes = DUMMY_FINE_TYPES;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredFineTypes = DUMMY_FINE_TYPES.filter((fineType) =>
        fineType.name.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedFineTypes = filteredFineTypes.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedFineTypes,
      meta: {
        page: currentPage,
        take: pageSize,
        itemCount: filteredFineTypes.length
      }
    };
  } catch (error) {
    console.error('Error fetching fine types:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: { page: 0, take: 0, itemCount: 0 }
    };
  }
}

export async function getAllFineTypes() {
  console.log('getAllFineTypes called with dummy data');

  try {
    return DUMMY_FINE_TYPES;
  } catch (error) {
    console.error('Error fetching fine types:', error);
    return [];
  }
}
