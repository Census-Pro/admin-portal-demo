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

// Demo: Track verified application IDs (in-memory for demo purposes)
const verifiedApplicationIds = new Set<string>();

// Demo dummy data for relieving page
const dummyRelievingApplications: MoveInOutApplication[] = [
  {
    id: 'demo-relieve-001',
    createdAt: '2026-04-28T09:30:00Z',
    updatedAt: '2026-04-28T09:30:00Z',
    application_no: 'NRM-2026-001234',
    applicant_cid_no: '11512000123',
    applicant_contact_no: '17123456',
    cid_no: '11512000123',
    name: 'Tenzin Dorji',
    house_no: 'H-045',
    tharm_no: 'T-012',
    household_no: 'HH-THI-2024-0045',
    inter_dzongkhag: 'YES',
    gewog_id: '1',
    dzongkhag_id: '1',
    is_new_household: 'NO',
    area_type: 'URBAN',
    plot_owner_cid: '11403012789',
    plot_id: 'PLT-PARO-2024-0088',
    new_dzongkhag_id: '4',
    new_gewog_id: '12',
    status: 'SUBMITTED'
  },
  {
    id: 'demo-relieve-002',
    createdAt: '2026-04-29T11:15:00Z',
    updatedAt: '2026-04-29T11:15:00Z',
    application_no: 'NRM-2026-001235',
    applicant_cid_no: '11602034567',
    applicant_contact_no: '17654321',
    cid_no: '11602034567',
    name: 'Sonam Wangmo',
    house_no: 'H-112',
    tharm_no: 'T-034',
    household_no: 'HH-THI-2024-0112',
    inter_dzongkhag: 'NO',
    gewog_id: '1',
    dzongkhag_id: '1',
    is_new_household: 'YES',
    area_type: 'URBAN',
    new_household_no: 'HH-THI-2026-NEW-0003',
    new_house_no: 'H-201',
    new_tharm_no: 'T-067',
    new_hoh_cid: '11602034567',
    new_gewog_id: '2',
    new_dzongkhag_id: '1',
    status: 'SUBMITTED'
  },
  {
    id: 'demo-relieve-003',
    createdAt: '2026-04-30T14:00:00Z',
    updatedAt: '2026-04-30T14:00:00Z',
    application_no: 'NRM-2026-001236',
    applicant_cid_no: '11701098765',
    applicant_contact_no: '77889900',
    cid_no: '11701098765',
    name: 'Karma Phuntsho',
    house_no: 'H-078',
    tharm_no: 'T-019',
    household_no: 'HH-THI-2024-0078',
    inter_dzongkhag: 'YES',
    gewog_id: '1',
    dzongkhag_id: '1',
    is_new_household: 'NO',
    area_type: 'RURAL',
    plot_owner_cid: '11305056789',
    plot_id: 'PLT-PUNA-2023-0155',
    new_dzongkhag_id: '7',
    new_gewog_id: '23',
    status: 'SUBMITTED'
  }
];

export async function getSubmittedMoveInOutApplications() {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error('No user session found');
    }

    // Get gewog_id from user's office location
    const officeLocationId = session.user.officeLocationId;

    if (!officeLocationId) {
      // Demo fallback: return dummy data when no office location set
      const filtered = dummyRelievingApplications.filter(
        (app) => !verifiedApplicationIds.has(app.id)
      );
      return {
        success: true,
        data: filtered,
        total_count: filtered.length
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

      // Demo fallback: return dummy data on API error
      const filtered = dummyRelievingApplications.filter(
        (app) => !verifiedApplicationIds.has(app.id)
      );
      return {
        success: true,
        data: filtered,
        total_count: filtered.length
      };
    }

    const result = await response.json();
    const applications = Array.isArray(result) ? result : result.data || [];

    console.log(
      '[getSubmittedMoveInOutApplications] Fetched successfully:',
      applications.length
    );

    const filteredDummy = dummyRelievingApplications.filter(
      (app) => !verifiedApplicationIds.has(app.id)
    );
    const merged = [...filteredDummy, ...applications];

    return {
      success: true,
      data: merged,
      total_count: merged.length
    };
  } catch (error) {
    console.error(
      '[getSubmittedMoveInOutApplications] Unexpected error:',
      error
    );

    // Demo fallback: return dummy data when the service is unavailable
    const filtered = dummyRelievingApplications.filter(
      (app) => !verifiedApplicationIds.has(app.id)
    );
    return {
      success: true,
      data: filtered,
      total_count: filtered.length
    };
  }
}

export async function getMoveInOutById(id: string) {
  // Demo: check dummy data first
  const dummyMatch =
    dummyRelievingApplications.find((app) => app.id === id) ??
    dummyEndorseApplications.find((app) => app.id === id) ??
    dummyApproveApplications.find((app) => app.id === id);
  if (dummyMatch) {
    return { success: true, data: dummyMatch };
  }
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

// Demo dummy data for receiving/endorse page (same people, VERIFIED status)
const dummyEndorseApplications: MoveInOutApplication[] = [
  {
    id: 'demo-endorse-001',
    createdAt: '2026-04-28T09:30:00Z',
    updatedAt: '2026-04-29T10:00:00Z',
    application_no: 'NRM-2026-001234',
    applicant_cid_no: '11512000123',
    applicant_contact_no: '17123456',
    cid_no: '11512000123',
    name: 'Tenzin Dorji',
    house_no: 'H-045',
    tharm_no: 'T-012',
    household_no: 'HH-THI-2024-0045',
    inter_dzongkhag: 'YES',
    gewog_id: '1',
    dzongkhag_id: '1',
    is_new_household: 'NO',
    area_type: 'URBAN',
    plot_owner_cid: '11403012789',
    plot_id: 'PLT-PARO-2024-0088',
    new_dzongkhag_id: '4',
    new_gewog_id: '12',
    status: 'VERIFIED'
  },
  {
    id: 'demo-endorse-002',
    createdAt: '2026-04-29T11:15:00Z',
    updatedAt: '2026-04-30T09:00:00Z',
    application_no: 'NRM-2026-001235',
    applicant_cid_no: '11602034567',
    applicant_contact_no: '17654321',
    cid_no: '11602034567',
    name: 'Sonam Wangmo',
    house_no: 'H-112',
    tharm_no: 'T-034',
    household_no: 'HH-THI-2024-0112',
    inter_dzongkhag: 'NO',
    gewog_id: '1',
    dzongkhag_id: '1',
    is_new_household: 'YES',
    area_type: 'URBAN',
    new_household_no: 'HH-THI-2026-NEW-0003',
    new_house_no: 'H-201',
    new_tharm_no: 'T-067',
    new_hoh_cid: '11602034567',
    new_gewog_id: '2',
    new_dzongkhag_id: '1',
    status: 'VERIFIED'
  },
  {
    id: 'demo-endorse-003',
    createdAt: '2026-04-30T14:00:00Z',
    updatedAt: '2026-05-01T08:30:00Z',
    application_no: 'NRM-2026-001236',
    applicant_cid_no: '11701098765',
    applicant_contact_no: '77889900',
    cid_no: '11701098765',
    name: 'Karma Phuntsho',
    house_no: 'H-078',
    tharm_no: 'T-019',
    household_no: 'HH-THI-2024-0078',
    inter_dzongkhag: 'YES',
    gewog_id: '1',
    dzongkhag_id: '1',
    is_new_household: 'NO',
    area_type: 'RURAL',
    plot_owner_cid: '11305056789',
    plot_id: 'PLT-PUNA-2023-0155',
    new_dzongkhag_id: '7',
    new_gewog_id: '23',
    status: 'VERIFIED'
  }
];

export async function getVerifiedReceivingMoveInOutApplications() {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error('No user session found');
    }

    // Get gewog_id from user's office location
    const gewogId = session.user.officeLocationId;

    if (!gewogId) {
      // Demo fallback
      return {
        success: true,
        data: dummyEndorseApplications,
        total_count: dummyEndorseApplications.length
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

      // Demo fallback
      return {
        success: true,
        data: dummyEndorseApplications,
        total_count: dummyEndorseApplications.length
      };
    }

    const result = await response.json();
    const applications = Array.isArray(result) ? result : result.data || [];

    console.log(
      '[getVerifiedReceivingMoveInOutApplications] Fetched successfully:',
      applications.length
    );

    const merged = [...dummyEndorseApplications, ...applications];

    return {
      success: true,
      data: merged,
      total_count: merged.length
    };
  } catch (error) {
    console.error(
      '[getVerifiedReceivingMoveInOutApplications] Unexpected error:',
      error
    );

    // Demo fallback
    return {
      success: true,
      data: dummyEndorseApplications,
      total_count: dummyEndorseApplications.length
    };
  }
}

// Demo dummy data for receiving/approve page (same people, ENDORSED status)
const dummyApproveApplications: MoveInOutApplication[] = [
  {
    id: 'demo-approve-001',
    createdAt: '2026-04-28T09:30:00Z',
    updatedAt: '2026-04-30T10:00:00Z',
    application_no: 'NRM-2026-001234',
    applicant_cid_no: '11512000123',
    applicant_contact_no: '17123456',
    cid_no: '11512000123',
    name: 'Tenzin Dorji',
    house_no: 'H-045',
    tharm_no: 'T-012',
    household_no: 'HH-THI-2024-0045',
    inter_dzongkhag: 'YES',
    gewog_id: '1',
    dzongkhag_id: '1',
    is_new_household: 'NO',
    area_type: 'URBAN',
    plot_owner_cid: '11403012789',
    plot_id: 'PLT-PARO-2024-0088',
    new_dzongkhag_id: '4',
    new_gewog_id: '12',
    status: 'ENDORSED'
  },
  {
    id: 'demo-approve-002',
    createdAt: '2026-04-29T11:15:00Z',
    updatedAt: '2026-04-30T12:00:00Z',
    application_no: 'NRM-2026-001235',
    applicant_cid_no: '11602034567',
    applicant_contact_no: '17654321',
    cid_no: '11602034567',
    name: 'Sonam Wangmo',
    house_no: 'H-112',
    tharm_no: 'T-034',
    household_no: 'HH-THI-2024-0112',
    inter_dzongkhag: 'NO',
    gewog_id: '1',
    dzongkhag_id: '1',
    is_new_household: 'YES',
    area_type: 'URBAN',
    new_household_no: 'HH-THI-2026-NEW-0003',
    new_house_no: 'H-201',
    new_tharm_no: 'T-067',
    new_hoh_cid: '11602034567',
    new_gewog_id: '2',
    new_dzongkhag_id: '1',
    status: 'ENDORSED'
  },
  {
    id: 'demo-approve-003',
    createdAt: '2026-04-30T14:00:00Z',
    updatedAt: '2026-05-01T09:00:00Z',
    application_no: 'NRM-2026-001236',
    applicant_cid_no: '11701098765',
    applicant_contact_no: '77889900',
    cid_no: '11701098765',
    name: 'Karma Phuntsho',
    house_no: 'H-078',
    tharm_no: 'T-019',
    household_no: 'HH-THI-2024-0078',
    inter_dzongkhag: 'YES',
    gewog_id: '1',
    dzongkhag_id: '1',
    is_new_household: 'NO',
    area_type: 'RURAL',
    plot_owner_cid: '11305056789',
    plot_id: 'PLT-PUNA-2023-0155',
    new_dzongkhag_id: '7',
    new_gewog_id: '23',
    status: 'ENDORSED'
  }
];

export async function getEndorsedReceivingMoveInOutApplications() {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error('No user session found');
    }

    // Use office location ID directly as dzongkhag_id
    const dzongkhagId = session.user.officeLocationId;

    if (!dzongkhagId) {
      // Demo fallback
      return {
        success: true,
        data: dummyApproveApplications,
        total_count: dummyApproveApplications.length
      };
    }

    const headers = await instance();

    // Fetch endorsed applications by dzongkhag
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

      // Demo fallback
      return {
        success: true,
        data: dummyApproveApplications,
        total_count: dummyApproveApplications.length
      };
    }

    const result = await response.json();
    const applications = Array.isArray(result) ? result : result.data || [];

    console.log(
      '[getEndorsedReceivingMoveInOutApplications] Fetched successfully:',
      applications.length
    );

    const merged = [...dummyApproveApplications, ...applications];

    return {
      success: true,
      data: merged,
      total_count: merged.length
    };
  } catch (error) {
    console.error(
      '[getEndorsedReceivingMoveInOutApplications] Unexpected error:',
      error
    );

    // Demo fallback
    return {
      success: true,
      data: dummyApproveApplications,
      total_count: dummyApproveApplications.length
    };
  }
}

export async function verifyMoveInOut(id: string) {
  // Demo: Mark as verified for demo purposes
  verifiedApplicationIds.add(id);
  console.log('[verifyMoveInOut] Marked as verified:', id);

  // Also update the application status in dummy data
  const applicationIndex = dummyRelievingApplications.findIndex(
    (app) => app.id === id
  );
  if (applicationIndex !== -1) {
    dummyRelievingApplications[applicationIndex].status = 'VERIFIED';
    dummyRelievingApplications[applicationIndex].updatedAt =
      new Date().toISOString();
  }

  // In real implementation, would call API to update status to VERIFIED
  return {
    success: true,
    data: { id, status: 'VERIFIED' }
  };
}

export async function resetMoveInOutDemo() {
  // Demo: Clear all verified application IDs
  verifiedApplicationIds.clear();

  // Reset dummy data to original SUBMITTED status
  dummyRelievingApplications.forEach((app, index) => {
    dummyRelievingApplications[index].status = 'SUBMITTED';
    dummyRelievingApplications[index].updatedAt = app.createdAt;
  });

  console.log('[resetMoveInOutDemo] All demo state reset');
  return { success: true };
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
