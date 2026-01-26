'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL = process.env.API_URL || 'http://localhost:5001';

export async function getUsers(
  page: number = 1,
  take: number = 10,
  search: string = ''
) {
  console.log('getUsers called with:', { page, take, search });
  try {
    const headers = await instance();

    const params = new URLSearchParams({
      page: page.toString(),
      take: take.toString()
    });

    if (search) {
      params.append('q', search);
    }

    const url = `${API_URL}/admin?${params.toString()}`;
    console.log('Fetching users from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch users';

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
          "You don't have permission to view users. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage,
        data: [],
        count: 0
      };
    }

    const result = await response.json();
    console.log('Users fetched successfully:', result.data?.length);

    return {
      success: true,
      data: result.data || [],
      count: result.count || 0
    };
  } catch (error) {
    console.error('Error in getUsers:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      count: 0
    };
  }
}

export async function deleteUser(id: string) {
  try {
    const headers = await instance();

    const response = await fetch(`${API_URL}/admin/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to delete user'
      };
    }

    revalidatePath('/dashboard/user');

    return {
      success: true,
      message: 'User deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user'
    };
  }
}

export async function createUser(data: any) {
  try {
    const headers = await instance();

    const response = await fetch(`${API_URL}/admin`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to create user'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/user');

    return {
      success: true,
      data: result,
      message: 'User created successfully'
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user'
    };
  }
}

// Agency Actions
export async function getAgencies() {
  try {
    const headers = await instance();

    const url = `${API_URL}/agencies?page=1&take=100`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agencies');
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
      meta: data.meta
    };
  } catch (error) {
    console.error('getAgencies error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// Office Location Actions
export async function getOfficeLocations() {
  try {
    const headers = await instance();

    const url = `${API_URL}/office-locations?page=1&take=100`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Office locations API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      if (response.status === 401) {
        return {
          success: false,
          error: 'Unauthorized: Please check your permissions'
        };
      } else if (response.status === 404) {
        return {
          success: false,
          error: 'Office locations endpoint not found'
        };
      }

      return {
        success: false,
        error: `Failed to fetch office locations: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
      meta: data.meta
    };
  } catch (error) {
    console.error('getOfficeLocations error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    };
  }
}
