'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createCidApplicationReason(formData: any) {
  try {
    const response = await fetch(`${API_URL}/cid-application-reasons`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        data?.message ||
        'Failed to add CID application reason';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/cid-application-reasons');
    return data;
  } catch (error) {
    console.error('Error creating CID application reason:', error);
    return { error: true, message: 'Failed to add CID application reason' };
  }
}

export async function getCidApplicationReasons({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  try {
    console.log('Fetching all CID application reasons from /all endpoint');
    const response = await fetch(`${API_URL}/cid-application-reasons/all`, {
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

      // Log the specific validation messages if available
      if (errorData?.message && Array.isArray(errorData.message)) {
        console.error('Validation errors:', errorData.message);
      }

      return {
        page: 0,
        limit: 0,
        totalCidApplicationReasons: 0,
        cidApplicationReasons: []
      };
    }

    const data = await response.json();
    console.log('API Response data:', data);

    // For /all endpoint, data might be directly an array or in data.data
    const cidApplicationReasons = Array.isArray(data) ? data : data.data || [];

    console.log('Parsed data:', {
      totalCidApplicationReasons: cidApplicationReasons.length,
      cidApplicationReasons
    });

    return {
      page: 1,
      limit: cidApplicationReasons.length,
      totalCidApplicationReasons: cidApplicationReasons.length,
      cidApplicationReasons
    };
  } catch (error) {
    console.error('Error fetching CID application reasons:', error);
    return {
      page: 0,
      limit: 0,
      totalCidApplicationReasons: 0,
      cidApplicationReasons: []
    };
  }
}

export async function getAllCidApplicationReasons() {
  try {
    const response = await fetch(`${API_URL}/cid-application-reasons/all`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch CID application reasons: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching CID application reasons:', error);
  }
}

export async function getCidApplicationReasonById(id: string) {
  try {
    const response = await fetch(`${API_URL}/cid-application-reasons/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch CID application reason: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching CID application reason:', error);
    return {
      error: true,
      message: 'Failed to fetch CID application reason'
    };
  }
}

export async function deleteCidApplicationReason(id?: string) {
  try {
    const response = await fetch(`${API_URL}/cid-application-reasons/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete CID application reason: ${response.statusText}`
      };
    }

    revalidatePath('/dashboard/cid-application-reasons');
    return {
      error: false,
      message: 'CID application reason deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting CID application reason:', error);
    return { error: true, message: 'Failed to delete CID application reason' };
  }
}

export async function updateCidApplicationReason(id: string, data: any) {
  try {
    const response = await fetch(`${API_URL}/cid-application-reasons/${id}`, {
      method: 'PATCH',
      headers: await instance(),
      body: JSON.stringify(data)
    });

    const res = await response.json();

    if (!response.ok || res?.error) {
      const errorMessage =
        (res?.error as ApiErrorResponse)?.message ||
        'Failed to update CID application reason';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/cid-application-reasons');
    return res;
  } catch (error) {
    console.error('Error updating CID application reason:', error);
    return { error: true, message: 'Failed to update CID application reason' };
  }
}
