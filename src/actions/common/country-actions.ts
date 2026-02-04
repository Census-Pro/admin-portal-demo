'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL =
  process.env.AUTH_SERVICE || process.env.API_URL || 'http://localhost:5001';

export async function getCountries() {
  try {
    const headers = await instance();
    const url = `${API_URL}/countries`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch countries';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (response.status === 403) {
        errorMessage =
          "You don't have permission to view countries. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage,
        data: []
      };
    }

    const result = await response.json();

    return {
      success: true,
      data: result.data || []
    };
  } catch (error) {
    console.error('getCountries error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    };
  }
}

export async function createCountry(data: {
  name: string;
  nationality: string;
}) {
  try {
    const headers = await instance();

    const response = await fetch(`${API_URL}/countries`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create country';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (response.status === 403) {
        errorMessage =
          "You don't have permission to create countries. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/countries');

    return {
      success: true,
      message: result.message || 'Country created successfully',
      data: result.data
    };
  } catch (error) {
    console.error('createCountry error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function updateCountry(data: {
  id: string;
  name?: string;
  nationality?: string;
  isActive?: boolean;
}) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/countries/${data.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update country';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/countries');

    return {
      success: true,
      message: result.message || 'Country updated successfully'
    };
  } catch (error) {
    console.error('updateCountry error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function deleteCountry(id: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/countries/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete country';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/countries');

    return {
      success: true,
      message: result.message || 'Country deleted successfully'
    };
  } catch (error) {
    console.error('deleteCountry error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
