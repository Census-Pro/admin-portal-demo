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

export async function getMoveInOutById(id: string) {
  try {
    const headers = await instance();
    const url = `${N_R_M_SERVICE}/move-in-out/${id}`;

    console.log('[getMoveInOutById] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch move-in-out application';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getMoveInOutById] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    const result = await response.json();
    console.log('[getMoveInOutById] Fetched successfully');

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('[getMoveInOutById] Unexpected error:', error);
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
      data: null
    };
  }
}

export async function getVerifiedReceivingMoveInOutApplications() {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error('No user session found');
    }

    // Get gewog_id from user's office location
    const gewogId = session.user.officeLocationId;

    if (!gewogId) {
      return {
        success: false,
        error: 'No office location found for user',
        data: [],
        total_count: 0
      };
    }

    const headers = await instance();
    const url = `${N_R_M_SERVICE}/move-in-out/status/verified/receiving-gewog/${gewogId}`;

    console.log(
      '[getVerifiedReceivingMoveInOutApplications] Fetching from:',
      url
    );

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage =
        'Failed to fetch verified receiving move-in-out applications';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error(
        '[getVerifiedReceivingMoveInOutApplications] API Error:',
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
      '[getVerifiedReceivingMoveInOutApplications] Fetched successfully:',
      applications.length
    );

    return {
      success: true,
      data: applications,
      total_count: applications.length
    };
  } catch (error) {
    console.error(
      '[getVerifiedReceivingMoveInOutApplications] Unexpected error:',
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

export async function getEndorsedReceivingMoveInOutApplications() {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error('No user session found');
    }

    // Get gewog_id from user's office location to fetch dzongkhag_id
    const gewogId = session.user.officeLocationId;

    if (!gewogId) {
      return {
        success: false,
        error: 'No office location found for user',
        data: [],
        total_count: 0
      };
    }

    const headers = await instance();

    // First, fetch gewog to get dzongkhag_id
    const COMMON_SERVICE =
      process.env.COMMON_SERVICE || 'http://localhost:5001';
    const gewogUrl = `${COMMON_SERVICE}/gewogs/${gewogId}`;

    const gewogResponse = await fetch(gewogUrl, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!gewogResponse.ok) {
      return {
        success: false,
        error: 'Failed to fetch gewog details',
        data: [],
        total_count: 0
      };
    }

    const gewogData = await gewogResponse.json();
    const dzongkhagId = gewogData.dzongkhag_id;

    if (!dzongkhagId) {
      return {
        success: false,
        error: 'No dzongkhag found for user gewog',
        data: [],
        total_count: 0
      };
    }

    // Now fetch endorsed applications by dzongkhag
    const url = `${N_R_M_SERVICE}/move-in-out/status/endorsed/receiving-dzongkhag/${dzongkhagId}`;

    console.log(
      '[getEndorsedReceivingMoveInOutApplications] Fetching from:',
      url
    );

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage =
        'Failed to fetch endorsed receiving move-in-out applications';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error(
        '[getEndorsedReceivingMoveInOutApplications] API Error:',
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
      '[getEndorsedReceivingMoveInOutApplications] Fetched successfully:',
      applications.length
    );

    return {
      success: true,
      data: applications,
      total_count: applications.length
    };
  } catch (error) {
    console.error(
      '[getEndorsedReceivingMoveInOutApplications] Unexpected error:',
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

export async function endorseMoveInOut(id: string) {
  try {
    const headers = await instance();
    const url = `${N_R_M_SERVICE}/move-in-out/${id}/update-status`;

    console.log('[endorseMoveInOut] Endorsing at:', url);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'ENDORSED' }),
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to endorse move-in-out application';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[endorseMoveInOut] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('[endorseMoveInOut] Endorsed successfully');

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('[endorseMoveInOut] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function approveMoveInOut(id: string) {
  try {
    const headers = await instance();
    const url = `${N_R_M_SERVICE}/move-in-out/${id}/update-status`;

    console.log('[approveMoveInOut] Approving at:', url);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'APPROVED' }),
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to approve move-in-out application';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[approveMoveInOut] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('[approveMoveInOut] Approved successfully');

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('[approveMoveInOut] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function rejectMoveInOut(id: string, remarks: string) {
  try {
    const headers = await instance();
    const url = `${N_R_M_SERVICE}/move-in-out/${id}/reject`;

    console.log('[rejectMoveInOut] Rejecting at:', url);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ remarks }),
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to reject move-in-out application';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[rejectMoveInOut] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('[rejectMoveInOut] Rejected successfully');

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('[rejectMoveInOut] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
