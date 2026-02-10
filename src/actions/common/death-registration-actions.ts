'use server';

import { instance } from '../instance';

const API_URL =
  process.env.COMMON_SERVICE || process.env.API_URL || 'http://localhost:5002';

export async function getDeathRegistrations() {
  try {
    const headers = await instance();
    const url = `${API_URL}/death-registrations`;

    console.log('[getDeathRegistrations] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    console.log('[getDeathRegistrations] Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to fetch death registrations';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getDeathRegistrations] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: []
      };
    }

    const result = await response.json();
    console.log(
      '[getDeathRegistrations] Fetched successfully:',
      result.data?.length || 0
    );

    return {
      success: true,
      data: result.data || result || []
    };
  } catch (error) {
    console.error('[getDeathRegistrations] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    };
  }
}

export async function getDeathRegistrationById(id: string) {
  try {
    const headers = await instance();
    const url = `${API_URL}/death-registrations/${id}`;

    console.log('[getDeathRegistrationById] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch death registration';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getDeathRegistrationById] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    const result = await response.json();
    console.log('[getDeathRegistrationById] Fetched successfully');

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    console.error('[getDeathRegistrationById] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: null
    };
  }
}
