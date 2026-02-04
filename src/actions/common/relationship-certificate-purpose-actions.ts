'use server';

import { updateTag } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createRelationshipCertificatePurpose(formData: any) {
  try {
    const response = await fetch(
      `${API_URL}/relationship-certificate-purposes`,
      {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: await instance()
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add relationship certificate purpose';
      return { error: true, message: errorMessage };
    }

    updateTag('relationship-certificate-purposes');
    return data;
  } catch (error) {
    console.error('Error creating relationship certificate purpose:', error);
    return {
      error: true,
      message: 'Failed to add relationship certificate purpose'
    };
  }
}

export async function getRelationshipCertificatePurposes({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  let url = `${API_URL}/relationship-certificate-purposes?page=${page}&take=${limit}`;
  try {
    if (search) {
      url += `&q=${search}`;
    }

    const response = await fetch(url, {
      headers: await instance(),
      next: { tags: ['relationship-certificate-purposes'] }
    });

    if (!response.ok) {
      return {
        page: 0,
        limit: 0,
        totalItems: 0,
        data: []
      };
    }

    const data = await response.json();

    const relationshipCertificatePurposes = data.data || [];
    const meta = data.meta || { page: 0, take: 0, itemCount: 0 };

    return {
      page: meta.page,
      limit: meta.take,
      totalItems: meta.itemCount,
      data: relationshipCertificatePurposes
    };
  } catch (error) {
    console.error('Error fetching relationship certificate purposes:', error);
    return {
      page: 0,
      limit: 0,
      totalItems: 0,
      data: []
    };
  }
}

export async function getAllRelationshipCertificatePurposes() {
  try {
    const response = await fetch(
      `${API_URL}/relationship-certificate-purposes/all`,
      {
        headers: await instance(),
        next: { tags: ['relationship-certificate-purposes'] }
      }
    );

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch relationship certificate purposes: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching relationship certificate purposes:', error);
  }
}

export async function deleteRelationshipCertificatePurpose(id?: string) {
  try {
    const response = await fetch(
      `${API_URL}/relationship-certificate-purposes/${id}`,
      {
        method: 'DELETE',
        headers: await instance()
      }
    );

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete relationship certificate purpose: ${response.statusText}`
      };
    }

    updateTag('relationship-certificate-purposes');
  } catch (error) {
    console.error('Error deleting relationship certificate purpose:', error);
    return null;
  }
}

export async function updateRelationshipCertificatePurpose(
  id: string,
  data: any
) {
  const response = await fetch(
    `${API_URL}/relationship-certificate-purposes/${id}`,
    {
      method: 'PATCH',
      headers: await instance(),
      body: JSON.stringify(data)
    }
  );

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message ||
      'Failed to update relationship certificate purpose';
    return { error: true, message: errorMessage };
  }

  updateTag('relationship-certificate-purposes');
  return res;
}
