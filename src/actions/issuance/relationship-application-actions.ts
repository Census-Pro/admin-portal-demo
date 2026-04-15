'use server';

import { instance } from '../instance';

const API_URL = process.env.ISSUANCE_SERVICE || 'http://localhost:5010';

export interface RelationshipApplication {
  id: string;
  createdAt: string;
  updatedAt: string;
  application_no: string;
  applicant_cid: string;
  applicant_name: string;
  applicant_contact_no?: string;
  relationship_to_cid: string;
  relationship_to_name: string;
  purpose_id: string;
  payment_type_id?: string | null;
  payment_service_type_id: string;
  application_status: string;
  purpose?: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
  };
}

/**
 * Get relationship applications with SUBMITTED status
 * @returns Applications with SUBMITTED status
 */
export async function getSubmittedRelationshipApplications() {
  try {
    console.log('Fetching submitted relationship applications');

    const response = await fetch(
      `${API_URL}/relationship-application/submitted`,
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
        'Failed to fetch relationship applications:',
        response.status,
        response.statusText,
        errorData
      );

      return {
        applications: [],
        total: 0,
        error: true,
        message: `Failed to fetch relationship applications: ${response.statusText}`
      };
    }

    const data = await response.json();
    console.log('Relationship Applications Response:', data);

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
    console.error('Error fetching relationship applications:', error);
    return {
      applications: [],
      total: 0,
      error: true,
      message: 'Failed to fetch relationship applications'
    };
  }
}

/**
 * Get a single relationship application by ID
 * @param id - The application ID
 */
export async function getRelationshipApplicationById(id: string) {
  try {
    const response = await fetch(`${API_URL}/relationship-application/${id}`, {
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
    console.error('Error fetching relationship application:', error);
    return {
      application: null,
      error: true,
      message: 'Failed to fetch application details'
    };
  }
}

/**
 * Get assessed relationship applications with pending payment
 * @returns Applications with ASSESSED status and pending payment
 */
export async function getAssessedPendingPaymentApplications() {
  try {
    console.log('Fetching assessed applications with pending payment');

    const response = await fetch(
      `${API_URL}/relationship-application/assessed/pending-payment`,
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
        'Failed to fetch assessed applications:',
        response.status,
        response.statusText,
        errorData
      );

      return {
        applications: [],
        total: 0,
        error: true,
        message: `Failed to fetch assessed applications: ${response.statusText}`
      };
    }

    const data = await response.json();
    console.log('Assessed Pending Payment Applications Response:', data);

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
    console.error('Error fetching assessed applications:', error);
    return {
      applications: [],
      total: 0,
      error: true,
      message: 'Failed to fetch assessed applications'
    };
  }
}

/**
 * Assess a relationship application (SUBMITTED → ASSESSED)
 * @param id - The application ID
 */
export async function assessRelationshipApplication(id: string) {
  try {
    const response = await fetch(
      `${API_URL}/relationship-application/${id}/assess-relationship-application`,
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
        'Failed to assess relationship application:',
        response.status,
        response.statusText,
        errorData
      );

      return {
        success: false,
        error: true,
        message:
          errorData?.message || 'Failed to assess relationship application'
      };
    }

    const data = await response.json();
    return {
      success: true,
      error: false,
      data: data.data || data
    };
  } catch (error) {
    console.error('Error assessing relationship application:', error);
    return {
      success: false,
      error: true,
      message: 'Failed to assess relationship application'
    };
  }
}
