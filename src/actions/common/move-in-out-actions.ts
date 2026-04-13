'use server';

import { instance } from '../instance';
import { auth } from '@/auth';

const N_R_M_SERVICE = process.env.N_R_M_SERVICE || 'http://localhost:5009';

export interface MoveInOutApplication {
  id: string;
  createdAt: string;
  updatedAt: string;
  application_no: string;
  applicant_cid_no: string;
  applicant_contact_no: string;
  cid_no: string;
  name: string;
  house_no: string;
  tharm_no: string;
  household_no: string;
  inter_dzongkhag: 'YES' | 'NO';
  gewog_id: string;
  dzongkhag_id: string;
  is_new_household: 'YES' | 'NO';
  area_type: 'RURAL' | 'URBAN';
  plot_owner_cid?: string;
  plot_id?: string;
  new_hoh_cid?: string;
  new_household_no?: string;
  new_house_no?: string;
  new_tharm_no?: string;
  new_village_id?: string;
  new_chiwog_id?: string;
  new_gewog_id?: string;
  new_dzongkhag_id?: string;
  status: string;
}

export async function getSubmittedMoveInOutApplications() {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error('No user session found');
    }

    // Get gewog_id from user's office location
    const officeLocationId = session.user.officeLocationId;

    if (!officeLocationId) {
      return {
        success: false,
        error: 'No office location found for user',
        data: [],
        total_count: 0
      };
    }

    const headers = await instance();
    const url = `${N_R_M_SERVICE}/move-in-out/status/submitted/gewog/${officeLocationId}`;

    console.log('[getSubmittedMoveInOutApplications] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    console.log(
      '[getSubmittedMoveInOutApplications] Response status:',
      response.status
    );

    if (!response.ok) {
      let errorMessage = 'Failed to fetch submitted move-in-out applications';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error(
        '[getSubmittedMoveInOutApplications] API Error:',
        errorMessage
      );

      return {
        success: false,
        error: errorMessage,
        data: [],
        total_count: 0
      };
    }

    const result = await response.json();
    const applications = Array.isArray(result) ? result : result.data || [];

    console.log(
      '[getSubmittedMoveInOutApplications] Fetched successfully:',
      applications.length
    );

    return {
      success: true,
      data: applications,
      total_count: applications.length
    };
  } catch (error) {
    console.error(
      '[getSubmittedMoveInOutApplications] Unexpected error:',
      error
    );
    const isConnRefused =
      error instanceof Error &&
      (error.message.includes('ECONNREFUSED') ||
        error.message.includes('fetch failed'));

    return {
      success: false,
      error: isConnRefused
        ? `N_R_M service is unreachable at ${N_R_M_SERVICE}. Make sure it is running.`
        : error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
      data: [],
      total_count: 0
    };
  }
}
