'use server';

import { instance } from '../instance';

const API_URL = process.env.ISSUANCE_SERVICE || 'http://localhost:5003';

export interface CIDApplication {
  id: string;
  applicant_name: string;
  applicant_cid?: string;
  date_of_birth: string;
  gender: string;
  dzongkhag: string;
  gewog: string;
  application_type: 'NEW' | 'RENEWAL' | 'REPLACEMENT' | 'UPDATE';
  status: string;
  created_at?: string;
  phone_number?: string;
  email?: string;
}

/**
 * Get CID issuance applications by payment service type ID
 * @param paymentTypeId - The payment service type ID (e.g., for Fresh, Renewal, or Replacement)
 * @returns Applications for the given payment type
 */
export async function getCIDApplicationsByPaymentType(paymentTypeId: string) {
  try {
    console.log(
      `Fetching CID applications for payment type ID: ${paymentTypeId}`
    );

    const response = await fetch(
      `${API_URL}/cid-issuance/applications/payment-types/${paymentTypeId}`,
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
        'Failed to fetch CID applications:',
        response.status,
        response.statusText,
        errorData
      );

      return {
        applications: [],
        total: 0,
        error: true,
        message: `Failed to fetch CID applications: ${response.statusText}`
      };
    }

    const data = await response.json();
    console.log('CID Applications Response:', data);

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
    console.error('Error fetching CID applications:', error);
    return {
      applications: [],
      total: 0,
      error: true,
      message: 'Failed to fetch CID applications'
    };
  }
}

/**
 * Get a single CID application by ID
 * @param id - The application ID
 */
export async function getCIDApplicationById(id: string) {
  try {
    console.log(`Fetching CID application by ID: ${id}`);
    console.log(`API URL: ${API_URL}/cid-issuance/applications/${id}`);

    const response = await fetch(`${API_URL}/cid-issuance/applications/${id}`, {
      headers: await instance(),
      cache: 'no-store'
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('Error response data:', errorData);
      } catch (e) {
        errorData = await response.text();
        console.error('Error response text:', errorData);
      }

      return {
        error: true,
        message: `Failed to fetch CID application: ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`
      };
    }

    const data = await response.json();
    console.log('CID Application data:', data);

    return {
      application: data.data || data,
      error: false
    };
  } catch (error) {
    console.error('Error fetching CID application:', error);
    return {
      error: true,
      message: `Failed to fetch CID application: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Get all CID applications (without filtering by payment type)
 */
export async function getAllCIDApplications() {
  try {
    const response = await fetch(`${API_URL}/cid-issuance/applications`, {
      headers: await instance(),
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        applications: [],
        total: 0,
        error: true,
        message: `Failed to fetch CID applications: ${response.statusText}`
      };
    }

    const data = await response.json();
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
    console.error('Error fetching all CID applications:', error);
    return {
      applications: [],
      total: 0,
      error: true,
      message: 'Failed to fetch CID applications'
    };
  }
}

/**
 * Get all SUBMITTED CID applications filtered by payment type
 * @param paymentType - The payment type enum (FRESH, RENEWAL, or REPLACEMENT)
 * @returns Submitted applications for the given payment type
 */
export async function getSubmittedApplicationsByPaymentType(
  paymentType: 'FRESH' | 'RENEWAL' | 'REPLACEMENT'
) {
  try {
    console.log(
      `Fetching SUBMITTED CID applications for payment type: ${paymentType}`
    );

    const response = await fetch(
      `${API_URL}/cid-issuance/applications/submitted?payment_type=${paymentType}`,
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
        'Failed to fetch SUBMITTED applications:',
        response.status,
        response.statusText,
        errorData
      );

      return {
        applications: [],
        total: 0,
        error: true,
        message: `Failed to fetch SUBMITTED applications: ${response.statusText}`
      };
    }

    const data = await response.json();
    console.log('SUBMITTED Applications Response:', data);

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
    console.error('Error fetching SUBMITTED applications:', error);
    return {
      applications: [],
      total: 0,
      error: true,
      message: 'Failed to fetch SUBMITTED applications'
    };
  }
}

/**
 * Assess a fresh CID application (changes status from SUBMITTED to ASSESSED)
 * @param id - The application ID
 * @returns Success status and message
 */
export async function assessFreshCidApplication(id: string) {
  try {
    console.log(`Assessing fresh CID application with ID: ${id}`);

    const response = await fetch(
      `${API_URL}/cid-issuance/applications/${id}/assess-fresh-cid`,
      {
        method: 'PATCH',
        headers: await instance(),
        cache: 'no-store'
      }
    );

    console.log(
      `Assess response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('Error response data:', errorData);
      } catch (e) {
        errorData = await response.text();
        console.error('Error response text:', errorData);
      }

      return {
        success: false,
        message: `Failed to assess application: ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`
      };
    }

    const data = await response.json();
    console.log('Assess application response:', data);

    return {
      success: true,
      message: 'Application assessed successfully',
      data: data.data || data
    };
  } catch (error) {
    console.error('Error assessing fresh CID application:', error);
    return {
      success: false,
      message: `Failed to assess application: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
