'use server';

import { instance } from '../instance';

const API_URL =
  process.env.COMMON_SERVICE || process.env.API_URL || 'http://localhost:5002';

const BIRTH_DEATH_API_URL =
  process.env.BIRTH_DEATH_SERVICE || 'http://localhost:5004';

export type DeathApplicationStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'ENDORSED'
  | 'VERIFIED'
  | 'APPROVED'
  | 'REJECTED';

export async function getDeathApplicationsByStatus(
  status: DeathApplicationStatus
) {
  try {
    const headers = await instance();
    const url = `${BIRTH_DEATH_API_URL}/death-applications/get-status?status=${status}`;

    console.log('[getDeathApplicationsByStatus] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    console.log(
      '[getDeathApplicationsByStatus] Response status:',
      response.status
    );

    if (!response.ok) {
      let errorMessage = 'Failed to fetch death applications';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getDeathApplicationsByStatus] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: [],
        total_count: 0
      };
    }

    const result = await response.json();
    console.log(
      '[getDeathApplicationsByStatus] Fetched successfully:',
      result.total_count ?? result.data?.length ?? 0
    );

    return {
      success: true,
      data: result.data || [],
      total_count: result.total_count ?? result.data?.length ?? 0
    };
  } catch (error) {
    console.error('[getDeathApplicationsByStatus] Unexpected error:', error);
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

export async function getSubmittedDeathApplications() {
  try {
    const headers = await instance();
    const url = `${BIRTH_DEATH_API_URL}/death-applications/submitted`;

    console.log('[getSubmittedDeathApplications] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    console.log(
      '[getSubmittedDeathApplications] Response status:',
      response.status
    );

    if (!response.ok) {
      let errorMessage = 'Failed to fetch submitted death applications';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getSubmittedDeathApplications] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: [],
        total_count: 0
      };
    }

    const result = await response.json();
    const data = Array.isArray(result) ? result : result.data || [];

    console.log(
      '[getSubmittedDeathApplications] Fetched successfully:',
      data.length
    );

    return {
      success: true,
      data,
      total_count: data.length
    };
  } catch (error) {
    console.error('[getSubmittedDeathApplications] Unexpected error:', error);
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

export async function getEndorsedDeathApplications() {
  try {
    const headers = await instance();
    const url = `${BIRTH_DEATH_API_URL}/death-applications/endorsed`;

    console.log('[getEndorsedDeathApplications] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    console.log(
      '[getEndorsedDeathApplications] Response status:',
      response.status
    );

    if (!response.ok) {
      let errorMessage = 'Failed to fetch endorsed death applications';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getEndorsedDeathApplications] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: [],
        total_count: 0
      };
    }

    const result = await response.json();
    const data = Array.isArray(result) ? result : result.data || [];

    console.log(
      '[getEndorsedDeathApplications] Fetched successfully:',
      data.length
    );

    return {
      success: true,
      data,
      total_count: data.length
    };
  } catch (error) {
    console.error('[getEndorsedDeathApplications] Unexpected error:', error);
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

export async function getDeathApplicationById(id: string) {
  try {
    const headers = await instance();
    const url = `${BIRTH_DEATH_API_URL}/death-applications/${id}`;

    console.log('[getDeathApplicationById] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch death application';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getDeathApplicationById] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    const result = await response.json();
    console.log('[getDeathApplicationById] Fetched successfully');

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('[getDeathApplicationById] Unexpected error:', error);
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

export async function getDeathRegistrations() {
  try {
    const headers = await instance();
    const url = `${API_URL}/death-registrations`;

    console.log('[getDeathRegistrations] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    console.log('[getDeathRegistrations] Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to fetch death registrations';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getDeathRegistrations] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: []
      };
    }

    const result = await response.json();
    console.log(
      '[getDeathRegistrations] Fetched successfully:',
      result.data?.length || 0
    );

    return {
      success: true,
      data: result.data || result || []
    };
  } catch (error) {
    console.error('[getDeathRegistrations] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    };
  }
}

export async function rejectDeathApplication(id: string, remarks: string) {
  try {
    const headers = await instance();
    const url = `${BIRTH_DEATH_API_URL}/death-applications/${id}/reject`;

    console.log('[rejectDeathApplication] Patching:', url, { remarks });

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ remarks })
    });

    console.log('[rejectDeathApplication] Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to reject death application';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      console.error('[rejectDeathApplication] API Error:', errorMessage);
      return { success: false, error: errorMessage };
    }

    const result = await response.json();
    console.log('[rejectDeathApplication] Rejected successfully');

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    console.error('[rejectDeathApplication] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function updateDeathApplicationStatus(
  id: string,
  status: DeathApplicationStatus
) {
  try {
    const headers = await instance();
    const url = `${BIRTH_DEATH_API_URL}/death-applications/${id}`;

    console.log('[updateDeathApplicationStatus] Patching:', url, { status });

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    console.log(
      '[updateDeathApplicationStatus] Response status:',
      response.status
    );

    if (!response.ok) {
      let errorMessage = 'Failed to update death application status';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[updateDeathApplicationStatus] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('[updateDeathApplicationStatus] Updated successfully');

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    console.error('[updateDeathApplicationStatus] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function getDeathRegistrationById(id: string) {
  try {
    const headers = await instance();
    const url = `${API_URL}/death-registrations/${id}`;

    console.log('[getDeathRegistrationById] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch death registration';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getDeathRegistrationById] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    const result = await response.json();
    console.log('[getDeathRegistrationById] Fetched successfully');

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    console.error('[getDeathRegistrationById] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: null
    };
  }
}
