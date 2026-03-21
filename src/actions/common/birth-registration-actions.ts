'use server';

import { instance } from '../instance';

const API_URL =
  process.env.COMMON_SERVICE || process.env.API_URL || 'http://localhost:5002';

const BIRTH_DEATH_API_URL =
  process.env.BIRTH_DEATH_SERVICE || 'http://localhost:5004';

export type BirthApplicationStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'ENDORSED'
  | 'VERIFIED'
  | 'APPROVED'
  | 'REJECTED';

export async function getBirthApplicationsByStatus(
  status: BirthApplicationStatus
) {
  try {
    const headers = await instance();
    const url = `${BIRTH_DEATH_API_URL}/birth-applications/get-status?status=${status}`;

    console.log('[getBirthApplicationsByStatus] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    console.log(
      '[getBirthApplicationsByStatus] Response status:',
      response.status
    );

    if (!response.ok) {
      let errorMessage = 'Failed to fetch birth applications';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getBirthApplicationsByStatus] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: [],
        total_count: 0
      };
    }

    const result = await response.json();
    console.log(
      '[getBirthApplicationsByStatus] Fetched successfully:',
      result.total_count ?? result.data?.length ?? 0
    );

    return {
      success: true,
      data: result.data || [],
      total_count: result.total_count ?? result.data?.length ?? 0
    };
  } catch (error) {
    console.error('[getBirthApplicationsByStatus] Unexpected error:', error);
    const isConnRefused =
      error instanceof Error &&
      (error.message.includes('ECONNREFUSED') ||
        error.message.includes('fetch failed'));
    return {
      success: false,
      error: isConnRefused
        ? `Birth-death service is unreachable at ${BIRTH_DEATH_API_URL}. Make sure it is running.`
        : error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
      data: [],
      total_count: 0
    };
  }
}

export async function getSubmittedBirthApplications() {
  try {
    const headers = await instance();
    const url = `${BIRTH_DEATH_API_URL}/birth-applications/submitted`;

    console.log('[getSubmittedBirthApplications] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch submitted birth applications';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      return { success: false, error: errorMessage, data: [], total_count: 0 };
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data || result || [],
      total_count: result.total_count ?? result.data?.length ?? 0
    };
  } catch (error) {
    const isConnRefused =
      error instanceof Error &&
      (error.message.includes('ECONNREFUSED') ||
        error.message.includes('fetch failed'));
    return {
      success: false,
      error: isConnRefused
        ? `Birth-death service is unreachable at ${BIRTH_DEATH_API_URL}. Make sure it is running.`
        : error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
      data: [],
      total_count: 0
    };
  }
}

export async function getEndorsedBirthApplications() {
  try {
    const headers = await instance();
    const url = `${BIRTH_DEATH_API_URL}/birth-applications/endorsed`;

    console.log('[getEndorsedBirthApplications] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch endorsed birth applications';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      return { success: false, error: errorMessage, data: [], total_count: 0 };
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data || result || [],
      total_count: result.total_count ?? result.data?.length ?? 0
    };
  } catch (error) {
    const isConnRefused =
      error instanceof Error &&
      (error.message.includes('ECONNREFUSED') ||
        error.message.includes('fetch failed'));
    return {
      success: false,
      error: isConnRefused
        ? `Birth-death service is unreachable at ${BIRTH_DEATH_API_URL}. Make sure it is running.`
        : error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
      data: [],
      total_count: 0
    };
  }
}

export async function getBirthRegistrations() {
  try {
    const headers = await instance();
    const url = `${API_URL}/birth-registrations`;

    console.log('[getBirthRegistrations] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    console.log('[getBirthRegistrations] Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to fetch birth registrations';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getBirthRegistrations] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: []
      };
    }

    const result = await response.json();
    console.log(
      '[getBirthRegistrations] Fetched successfully:',
      result.data?.length || 0
    );

    return {
      success: true,
      data: result.data || result || []
    };
  } catch (error) {
    console.error('[getBirthRegistrations] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    };
  }
}

export async function rejectBirthApplication(id: string, remarks: string) {
  try {
    const headers = await instance();
    const url = `${BIRTH_DEATH_API_URL}/birth-applications/${id}/reject`;

    console.log('[rejectBirthApplication] Patching:', url, { remarks });

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ remarks })
    });

    console.log('[rejectBirthApplication] Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to reject birth application';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      console.error('[rejectBirthApplication] API Error:', errorMessage);
      return { success: false, error: errorMessage };
    }

    const result = await response.json();
    console.log('[rejectBirthApplication] Rejected successfully');

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    console.error('[rejectBirthApplication] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function updateBirthApplicationStatus(
  id: string,
  status: BirthApplicationStatus,
  remarks?: string
) {
  try {
    const headers = await instance();
    const url = `${BIRTH_DEATH_API_URL}/birth-applications/${id}`;

    console.log('[updateBirthApplicationStatus] Patching:', url, {
      status,
      remarks
    });

    const body: Record<string, string> = { status };
    if (remarks) body.remarks = remarks;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log(
      '[updateBirthApplicationStatus] Response status:',
      response.status
    );

    if (!response.ok) {
      let errorMessage = 'Failed to update birth application status';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[updateBirthApplicationStatus] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('[updateBirthApplicationStatus] Updated successfully');

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    console.error('[updateBirthApplicationStatus] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function getBirthRegistrationById(id: string) {
  try {
    const headers = await instance();
    const url = `${API_URL}/birth-registrations/${id}`;

    console.log('[getBirthRegistrationById] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch birth registration';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getBirthRegistrationById] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    const result = await response.json();
    console.log('[getBirthRegistrationById] Fetched successfully');

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    console.error('[getBirthRegistrationById] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: null
    };
  }
}

export async function getBirthApplicationById(id: string) {
  try {
    const headers = await instance();
    const url = `${BIRTH_DEATH_API_URL}/birth-applications/${id}`;

    console.log('[getBirthApplicationById] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch birth application';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getBirthApplicationById] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    const result = await response.json();
    console.log('[getBirthApplicationById] Fetched successfully');

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('[getBirthApplicationById] Unexpected error:', error);
    const isConnRefused =
      error instanceof Error &&
      (error.message.includes('ECONNREFUSED') ||
        error.message.includes('fetch failed'));
    return {
      success: false,
      error: isConnRefused
        ? `Birth-death service is unreachable at ${BIRTH_DEATH_API_URL}. Make sure it is running.`
        : error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
      data: null
    };
  }
}
