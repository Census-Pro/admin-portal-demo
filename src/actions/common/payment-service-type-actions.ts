'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createPaymentServiceType(formData: any) {
  try {
    const response = await fetch(`${API_URL}/payment-service-types`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        data?.message ||
        'Failed to add payment service type';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/payment-service-types');
    return data;
  } catch (error) {
    console.error('Error creating payment service type:', error);
    return { error: true, message: 'Failed to add payment service type' };
  }
}

// Dummy payment service types data
const DUMMY_PAYMENT_SERVICE_TYPES = [
  { id: '1', name: 'CID Application Fee', isActive: true },
  { id: '2', name: 'CID Renewal Fee', isActive: true },
  { id: '3', name: 'CID Replacement Fee', isActive: true },
  { id: '4', name: 'Birth Registration Fee', isActive: true },
  { id: '5', name: 'Death Registration Fee', isActive: true },
  { id: '6', name: 'Marriage Registration Fee', isActive: true },
  { id: '7', name: 'HOH Change Fee', isActive: true },
  { id: '8', name: 'Move In/Out Fee', isActive: true },
  { id: '9', name: 'Nationality Certificate Fee', isActive: true },
  { id: '10', name: 'Relation Certificate Fee', isActive: true },
  { id: '11', name: 'Fine Payment', isActive: true },
  { id: '12', name: 'Resettlement Fee', isActive: true }
];

export async function getPaymentServiceTypes({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  console.log('getPaymentServiceTypes called with dummy data:', {
    page,
    limit,
    search
  });

  try {
    // Filter payment service types based on search query
    let filteredTypes = DUMMY_PAYMENT_SERVICE_TYPES;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTypes = DUMMY_PAYMENT_SERVICE_TYPES.filter((type) =>
        type.name.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTypes = filteredTypes.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedTypes,
      meta: {
        page: currentPage,
        take: pageSize,
        itemCount: filteredTypes.length
      }
    };
  } catch (error) {
    console.error('Error fetching payment service types:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: { page: 0, take: 0, itemCount: 0 }
    };
  }
}

export async function getAllPaymentServiceTypes() {
  try {
    const response = await fetch(`${API_URL}/payment-service-types/all`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch payment service types: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching payment service types:', error);
  }
}

export async function getSimplePaymentServiceTypes() {
  try {
    const response = await fetch(`${API_URL}/payment-service-types/simple`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch simple payment service types: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching simple payment service types:', error);
    return {
      error: true,
      message: 'Failed to fetch simple payment service types'
    };
  }
}

export async function getPaymentServiceTypeById(id: string) {
  try {
    const response = await fetch(`${API_URL}/payment-service-types/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch payment service type: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching payment service type:', error);
    return {
      error: true,
      message: 'Failed to fetch payment service type'
    };
  }
}

export async function deletePaymentServiceType(id?: string) {
  try {
    const response = await fetch(`${API_URL}/payment-service-types/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete payment service type: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/payment-service-types');
    return {
      error: false,
      message: 'Payment service type deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting payment service type:', error);
    return { error: true, message: 'Failed to delete payment service type' };
  }
}

export async function updatePaymentServiceType(id: string, data: any) {
  try {
    const response = await fetch(`${API_URL}/payment-service-types/${id}`, {
      method: 'PATCH',
      headers: await instance(),
      body: JSON.stringify(data)
    });

    const res = await response.json();

    if (!response.ok || res?.error) {
      const errorMessage =
        (res?.error as ApiErrorResponse)?.message ||
        'Failed to update payment service type';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/payment-service-types');
    return res;
  } catch (error) {
    console.error('Error updating payment service type:', error);
    return { error: true, message: 'Failed to update payment service type' };
  }
}
