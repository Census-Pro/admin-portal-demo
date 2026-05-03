'use server';

import { revalidatePath } from 'next/cache';
import { instance } from '../instance';

const API_URL = process.env.API_URL || 'http://localhost:5001';

// Dummy data for demo purposes
const DUMMY_USERS = [
  {
    id: '1',
    name: 'Super Admin',
    cidNo: '10910001327',
    email: 'admin@demo.gov.bt',
    role: 'SUPER_ADMIN',
    agencyName: 'Department of Civil Registration',
    officeLocationName: 'Thimphu',
    status: 'Active' as const,
    lastActive: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Tsogpa',
    cidNo: '11407002841',
    email: 'tsogpa@demo.gov.bt',
    role: 'ADMIN',
    agencyName: 'Department of Civil Registration',
    officeLocationName: 'Thimphu',
    status: 'Active' as const,
    lastActive: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Gup',
    cidNo: '10904003521',
    email: 'gup@demo.gov.bt',
    role: 'ADMIN',
    agencyName: 'Gewog Administration',
    officeLocationName: 'Punakha',
    status: 'Active' as const,
    lastActive: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Headquarters',
    cidNo: '11302004178',
    email: 'hq@demo.gov.bt',
    role: 'ADMIN',
    agencyName: 'Department of Civil Registration',
    officeLocationName: 'Thimphu',
    status: 'Active' as const,
    lastActive: new Date().toISOString()
  }
];

export async function getUsers(
  page: number = 1,
  take: number = 10,
  search: string = ''
) {
  console.log('getUsers called with dummy data:', { page, take, search });

  try {
    // Filter users based on search query
    let filteredUsers = DUMMY_USERS;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = DUMMY_USERS.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.cidNo?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.role?.toLowerCase().includes(searchLower) ||
          user.agencyName?.toLowerCase().includes(searchLower) ||
          user.officeLocationName?.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * take;
    const endIndex = startIndex + take;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedUsers,
      count: filteredUsers.length
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

// Dummy agencies data
const DUMMY_AGENCIES = [
  { id: '1', name: 'Ministry of Home Affairs', isActive: true },
  { id: '2', name: 'Department of Immigration', isActive: true },
  { id: '3', name: 'Regional Immigration Office', isActive: true },
  { id: '4', name: 'Dzongkhag Administration', isActive: true },
  { id: '5', name: 'Local Government Office', isActive: true },
  { id: '6', name: 'Civil Registration Office', isActive: true },
  { id: '7', name: 'National Registration Office', isActive: true }
];

// Agency Actions
export async function getAgencies() {
  try {
    console.log('Returning dummy agencies data');
    return {
      success: true,
      data: DUMMY_AGENCIES,
      meta: { itemCount: DUMMY_AGENCIES.length }
    };
  } catch (error) {
    console.error('getAgencies error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// Dummy office locations data
const DUMMY_OFFICE_LOCATIONS = [
  { id: '1', name: 'Thimphu', isActive: true },
  { id: '2', name: 'Paro', isActive: true },
  { id: '3', name: 'Punakha', isActive: true },
  { id: '4', name: 'Wangdue', isActive: true },
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

// Office Location Actions
export async function getOfficeLocations() {
  try {
    console.log('Returning dummy office locations data');
    return {
      success: true,
      data: DUMMY_OFFICE_LOCATIONS
    };
  } catch (error) {
    console.error('getOfficeLocations error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
