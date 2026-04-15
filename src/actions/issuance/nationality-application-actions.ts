'use server';

import { instance } from '../instance';

const API_URL = process.env.ISSUANCE_SERVICE || 'http://localhost:5010';

export interface NationalityApplication {
  id: string;
  createdAt: string;
  updatedAt: string;
  application_no: string;
  applicant_cid_no: string;
  applicant_contact_no: string;
  applicant_is: string;
  minor_cid: string | null;
  minor_name: string | null;
  dob: string | null;
  half_photo: string | null;
  payment_type_id: string | null;
  payment_service_type_id: string;
  parent_approval: string;
  application_status: string;
}

/**
 * Get nationality applications with SUBMITTED status
 * @returns Applications with SUBMITTED status
 */
export async function getSubmittedNationalityApplications() {
  try {
    console.log('Fetching submitted nationality applications');

    const response = await fetch(
      `${API_URL}/nationality-applications/submitted`,
      {
        headers: await instance(),
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      console.error(
        'Failed to fetch nationality applications:',
        response.status,
        response.statusText,
        errorData
      );

      return {
        applications: [],
        total: 0,
        error: true,
        message: `Failed to fetch nationality applications: ${response.statusText}`
      };
    }

    const data = await response.json();
    console.log('Nationality Applications Response:', data);

    // Handle different response structures
    const applications = Array.isArray(data)
      ? data
      : data.data || data.applications || [];
    const total = data.total || data.count || applications.length;

    return {
      applications,
      total,
      error: false
    };
  } catch (error) {
    console.error('Error fetching nationality applications:', error);
    return {
      applications: [],
      total: 0,
      error: true,
      message: 'Failed to fetch nationality applications'
    };
  }
}

/**
 * Get a single nationality application by ID
 * @param id - The application ID
 */
export async function getNationalityApplicationById(id: string) {
  try {
    const response = await fetch(`${API_URL}/nationality-applications/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        application: null,
        error: true,
        message: 'Failed to fetch application details'
      };
    }

    const data = await response.json();
    return {
      application: data.data || data,
      error: false
    };
  } catch (error) {
    console.error('Error fetching nationality application:', error);
    return {
      application: null,
      error: true,
      message: 'Failed to fetch application details'
    };
  }
}

/**
 * Assess a nationality application (SUBMITTED → ASSESSED)
 * @param id - The application ID
 */
export async function assessNationalityApplication(id: string) {
  try {
    const response = await fetch(
      `${API_URL}/nationality-applications/${id}/assess-nationality-certificate`,
      {
        method: 'PATCH',
        headers: await instance(),
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      console.error(
        'Failed to assess nationality application:',
        response.status,
        response.statusText,
        errorData
      );

      return {
        success: false,
        error: true,
        message: `Failed to assess application: ${response.statusText}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      error: false,
      data
    };
  } catch (error) {
    console.error('Error assessing nationality application:', error);
    return {
      success: false,
      error: true,
      message: 'Failed to assess application'
    };
  }
}
