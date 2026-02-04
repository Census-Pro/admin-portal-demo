'use server';

import { updateTag } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createCities(formData: any) {
  try {
    const response = await fetch(`${API_URL}/cities`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message || 'Failed to add cities';
      return { error: true, message: errorMessage };
    }

    updateTag('cities');
    return data;
  } catch (error) {
    console.error('Error creating city:', error);
    return { error: true, message: 'Failed to add cities' };
  }
}

export async function getCities({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  let url = `${API_URL}/cities?page=${page}&take=${limit}`;
  try {
    // Search
    if (search) {
      url += `&q=${search}`;
    }

    const response = await fetch(url, {
      headers: await instance(),
      next: { tags: ['cities'] }
    });

    if (!response.ok) {
      return {
        page: 0,
        limit: 0,
        totalCities: 0,
        cities: []
      };
    }

    const data = await response.json();

    const cities = data.data || [];
    const meta = data.meta || { page: 0, take: 0, itemCount: 0 };

    return {
      page: meta.page,
      limit: meta.take,
      totalCities: meta.itemCount,
      cities
    };
  } catch (error) {
    console.error('Error fetching cities:', error);
    return {
      page: 0,
      limit: 0,
      totalCities: 0,
      cities: []
    };
  }
}

export async function getAllCities() {
  try {
    const response = await fetch(`${API_URL}/cities/all`, {
      headers: await instance(),
      next: { tags: ['cities'] }
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch cities: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching cities:', error);
  }
}

export async function deleteCity(id?: string) {
  try {
    const response = await fetch(`${API_URL}/cities/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete city: ${response.statusText}`
      };
    }

    updateTag('cities');
  } catch (error) {
    console.error('Error deleting city:', error);
    return null;
  }
}

export async function updateCity(id: string, data: any) {
  const response = await fetch(`${API_URL}/cities/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message || 'Failed to update city';
    return { error: true, message: errorMessage };
  }

  updateTag('cities');
  return res;
}
