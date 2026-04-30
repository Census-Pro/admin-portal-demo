'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL =
  process.env.AUTH_SERVICE || process.env.API_URL || 'http://localhost:5001';

// Dummy office locations data
const DUMMY_OFFICE_LOCATIONS = [
  { id: '1', name: 'Thimphu', isActive: true },
  { id: '2', name: 'Paro', isActive: true },
  { id: '3', name: 'Punakha', isActive: true },
  { id: '4', name: 'Wangdue Phodrang', isActive: true },
  { id: '5', name: 'Phuentsholing', isActive: true },
  { id: '6', name: 'Gelephu', isActive: true },
  { id: '7', name: 'Samdrup Jongkhar', isActive: true },
  { id: '8', name: 'Trashigang', isActive: true },
  { id: '9', name: 'Mongar', isActive: true },
  { id: '10', name: 'Samtse', isActive: true },
  { id: '11', name: 'Haa', isActive: true },
  { id: '12', name: 'Lhuentse', isActive: true },
  { id: '13', name: 'Trongsa', isActive: true },
  { id: '14', name: 'Bumthang', isActive: true },
  { id: '15', name: 'Gasa', isActive: true },
  { id: '16', name: 'Zhemgang', isActive: true },
  { id: '17', name: 'Trashiyangtse', isActive: true },
  { id: '18', name: 'Pemagatshel', isActive: true },
  { id: '19', name: 'Sarpang', isActive: true },
  { id: '20', name: 'Tsirang', isActive: true }
];

export async function getOfficeLocations(
  page: number = 1,
  take: number = 10,
  search?: string
) {
  console.log('getOfficeLocations called with dummy data:', {
    page,
    take,
    search
  });

  try {
    // Filter office locations based on search query
    let filteredLocations = DUMMY_OFFICE_LOCATIONS;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredLocations = DUMMY_OFFICE_LOCATIONS.filter((location) =>
        location.name.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * take;
    const endIndex = startIndex + take;
    const paginatedLocations = filteredLocations.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedLocations,
      meta: { itemCount: filteredLocations.length }
    };
  } catch (error) {
    console.error('getOfficeLocations error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      meta: null
    };
  }
}

export async function createOfficeLocation(data: { name: string }) {
  try {
    const headers = await instance();

    const response = await fetch(`${API_URL}/office-locations`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create office location';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        errorMessage =
          "You don't have permission to create office locations. Please contact your administrator.";
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/office-locations');

    return {
      success: true,
      message: result.message || 'Office location created successfully',
      data: result.data
    };
  } catch (error) {
    console.error('createOfficeLocation error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function updateOfficeLocation(data: {
  id: string;
  name?: string;
  isActive?: boolean;
}) {
  try {
    const headers = await instance();
    // Only send the updatable fields in the body
    const { id, ...updateData } = data;
    const response = await fetch(`${API_URL}/office-locations/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update office location';

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
    revalidatePath('/dashboard/office-locations');

    return {
      success: true,
      message: result.message || 'Office location updated successfully'
    };
  } catch (error) {
    console.error('updateOfficeLocation error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function deleteOfficeLocation(id: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/office-locations/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete office location';

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
    revalidatePath('/dashboard/office-locations');

    return {
      success: true,
      message: result.message || 'Office location deleted successfully'
    };
  } catch (error) {
    console.error('deleteOfficeLocation error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
