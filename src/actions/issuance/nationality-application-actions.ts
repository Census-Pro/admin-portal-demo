'use server';

import { instance } from '../instance';

const API_URL = process.env.ISSUANCE_SERVICE || 'http://localhost:5010';

export interface NationalityApplication {
  id: string;
  created_at: string;
  updated_at: string;
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
 * Update nationality application status
 * @param id - The application ID
 * @param status - The new application status (SUBMITTED, ASSESSED, APPROVED, REJECTED)
 */
export async function updateNationalityApplicationStatus(
  id: string,
  status: string
) {
  try {
    const response = await fetch(
      `${API_URL}/nationality-applications/${id}/update-status`,
      {
        method: 'PATCH',
        headers: {
          ...(await instance()),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ application_status: status }),
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
        'Failed to update nationality application status:',
        response.status,
        response.statusText,
        errorData
      );

      return {
        success: false,
        error: true,
        message: `Failed to update application status: ${response.statusText}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      error: false,
      data
    };
  } catch (error) {
    console.error('Error updating nationality application status:', error);
    return {
      success: false,
      error: true,
      message: 'Failed to update application status'
    };
  }
}

/**
 * Assess a nationality application (SUBMITTED → ASSESSED)
 * @param id - The application ID
 */
export async function assessNationalityApplication(id: string) {
  return updateNationalityApplicationStatus(id, 'ASSESSED');
}

/**
 * Reject a nationality application
 * @param id - The application ID
 * @param remarks - Rejection remarks
 */
export async function rejectNationalityApplication(
  id: string,
  remarks: string
) {
  try {
    const response = await fetch(
      `${API_URL}/nationality-applications/${id}/reject`,
      {
        method: 'PATCH',
        headers: {
          ...(await instance()),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejected_remarks: remarks }),
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
        'Failed to reject nationality application:',
        response.status,
        response.statusText,
        errorData
      );

      return {
        success: false,
        error: true,
        message: `Failed to reject application: ${response.statusText}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      error: false,
      data
    };
  } catch (error) {
    console.error('Error rejecting nationality application:', error);
    return {
      success: false,
      error: true,
      message: 'Failed to reject application'
    };
  }
}
