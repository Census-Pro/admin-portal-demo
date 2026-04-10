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

export async function getPaymentServiceTypes({
  page = 1,
  limit = 10,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (search) {
      params.append('search', search);
    }

    console.log('Fetching payment service types with pagination');
    const response = await fetch(
      `${API_URL}/payment-service-types?${params.toString()}`,
      {
        headers: await instance(),
        cache: 'no-store'
      }
    );

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
        totalPaymentServiceTypes: 0,
        paymentServiceTypes: []
      };
    }

    const data = await response.json();
    console.log('API Response data:', data);

    // Handle paginated response structure
    const paymentServiceTypes = data.data || data.paymentServiceTypes || [];
    const total =
      data.total || data.totalPaymentServiceTypes || paymentServiceTypes.length;

    console.log('Parsed data:', {
      totalPaymentServiceTypes: total,
      page: data.page || page,
      limit: data.limit || limit,
      paymentServiceTypes
    });

    return {
      page: data.page || page,
      limit: data.limit || limit,
      totalPaymentServiceTypes: total,
      paymentServiceTypes
    };
  } catch (error) {
    console.error('Error fetching payment service types:', error);
    return {
      page: 0,
      limit: 0,
      totalPaymentServiceTypes: 0,
      paymentServiceTypes: []
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
