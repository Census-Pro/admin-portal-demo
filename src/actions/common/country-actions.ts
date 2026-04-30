'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL =
  process.env.COMMON_SERVICE || process.env.API_URL || 'http://localhost:3000';

// Dummy countries data
const DUMMY_COUNTRIES = [
  { id: '1', name: 'Bhutan', nationality: 'Bhutanese', isActive: true },
  { id: '2', name: 'India', nationality: 'Indian', isActive: true },
  { id: '3', name: 'Nepal', nationality: 'Nepalese', isActive: true },
  { id: '4', name: 'Bangladesh', nationality: 'Bangladeshi', isActive: true },
  { id: '5', name: 'Sri Lanka', nationality: 'Sri Lankan', isActive: true },
  { id: '6', name: 'Pakistan', nationality: 'Pakistani', isActive: true },
  { id: '7', name: 'Myanmar', nationality: 'Myanma', isActive: true },
  { id: '8', name: 'Thailand', nationality: 'Thai', isActive: true },
  { id: '9', name: 'China', nationality: 'Chinese', isActive: true },
  { id: '10', name: 'Japan', nationality: 'Japanese', isActive: true },
  {
    id: '11',
    name: 'South Korea',
    nationality: 'South Korean',
    isActive: true
  },
  { id: '12', name: 'Singapore', nationality: 'Singaporean', isActive: true },
  { id: '13', name: 'Malaysia', nationality: 'Malaysian', isActive: true },
  { id: '14', name: 'Indonesia', nationality: 'Indonesian', isActive: true },
  { id: '15', name: 'Philippines', nationality: 'Filipino', isActive: true },
  { id: '16', name: 'Australia', nationality: 'Australian', isActive: true },
  {
    id: '17',
    name: 'New Zealand',
    nationality: 'New Zealander',
    isActive: true
  },
  { id: '18', name: 'United States', nationality: 'American', isActive: true },
  { id: '19', name: 'Canada', nationality: 'Canadian', isActive: true },
  { id: '20', name: 'United Kingdom', nationality: 'British', isActive: true }
];

export async function getCountries(page: number = 1, take: number = 100) {
  console.log('getCountries called with dummy data:', { page, take });

  try {
    // Pagination
    const startIndex = (page - 1) * take;
    const endIndex = startIndex + take;
    const paginatedCountries = DUMMY_COUNTRIES.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedCountries
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

export async function getCountryById(id: string) {
  try {
    const response = await fetch(`${API_URL}/countries/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch country: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching country:', error);
    return { error: true, message: 'Failed to fetch country' };
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

      if (response.status === 403) {
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
      data: result.data || result
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
    const { id, ...updateData } = data;
    const headers = await instance();
    const response = await fetch(`${API_URL}/countries/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateData)
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

      // Handle 404 - Country not found (might have been already deleted)
      if (response.status === 404) {
        // Treat as success since the country doesn't exist anyway
        revalidatePath('/dashboard/countries');
        return {
          success: true,
          message: 'Country has already been deleted'
        };
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    // Handle empty response body
    let result = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      if (text) {
        try {
          result = JSON.parse(text);
        } catch {
          // Response is not valid JSON, but request was successful
        }
      }
    }

    revalidatePath('/dashboard/countries');

    return {
      success: true,
      message: result?.message || 'Country deleted successfully'
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
