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
