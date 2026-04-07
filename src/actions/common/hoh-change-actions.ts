'use server';

import { instance } from '../instance';

const AMENDMENT_API_URL =
  process.env.AMENDMENT_SERVICE || 'http://localhost:5008';

export async function getSubmittedHohChanges() {
  try {
    const headers = await instance();
    const url = `${AMENDMENT_API_URL}/hoh-changes/submitted`;

    console.log('[getSubmittedHohChanges] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch submitted HOH change applications';
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
      data: result.data || [],
      total_count: result.total_count || 0
    };
  } catch (error) {
    console.error('[getSubmittedHohChanges] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      total_count: 0
    };
  }
}

export async function getHohChanges(filters: any = {}) {
  try {
    const headers = await instance();
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const url = `${AMENDMENT_API_URL}/hoh-changes?${queryParams.toString()}`;

    console.log('[getHohChanges] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch HOH change applications';
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
      data: result.data || [],
      total_count: result.total_count || 0
    };
  } catch (error) {
    console.error('[getHohChanges] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      total_count: 0
    };
  }
}

export async function getHohApproveList(filters: any = {}) {
  try {
    const headers = await instance();
    const queryParams = new URLSearchParams();
    if (filters.dzongkhag) queryParams.append('dzongkhag', filters.dzongkhag);
    if (filters.gewog) queryParams.append('gewog', filters.gewog);
    if (filters.chiwog) queryParams.append('chiwog', filters.chiwog);
    if (filters.village) queryParams.append('village', filters.village);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const url = `${AMENDMENT_API_URL}/hoh-changes/approve-list?${queryParams.toString()}`;

    console.log('[getHohApproveList] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch HOH change applications for approval';
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
      data: result.data || [],
      total_count: result.total_count || 0
    };
  } catch (error) {
    console.error('[getHohApproveList] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: [],
      total_count: 0
    };
  }
}

export async function getHohChangeByApplicationNo(applicationNo: string) {
  try {
    const headers = await instance();
    const url = `${AMENDMENT_API_URL}/hoh-changes/${applicationNo}`;

    console.log('[getHohChangeByApplicationNo] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch HOH change application';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getHohChangeByApplicationNo] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    const result = await response.json();
    console.log('[getHohChangeByApplicationNo] Fetched successfully');

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    console.error('[getHohChangeByApplicationNo] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: null
    };
  }
}

export async function createHohChange(data: any) {
  try {
    const headers = await instance();
    const url = `${AMENDMENT_API_URL}/hoh-changes`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create HOH change application';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      return { success: false, error: errorMessage };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function approveHohChange(id: string) {
  try {
    const headers = await instance();
    const url = `${AMENDMENT_API_URL}/hoh-changes/${id}/change-status`;

    console.log('[approveHohChange] Approving:', url);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'VERIFIED' })
    });

    if (!response.ok) {
      let errorMessage = 'Failed to approve HOH change application';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      return { success: false, error: errorMessage };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function rejectHohChange(applicationNo: string, remarks: string) {
  try {
    const headers = await instance();
    const url = `${AMENDMENT_API_URL}/hoh-changes/${applicationNo}/reject`;

    console.log('[rejectHohChange] Rejecting:', url, { remarks });

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ remarks })
    });

    if (!response.ok) {
      let errorMessage = 'Failed to reject HOH change application';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      return { success: false, error: errorMessage };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
