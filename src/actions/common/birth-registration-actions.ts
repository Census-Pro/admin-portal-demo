'use server';

import { instance } from '../instance';

const API_URL =
  process.env.COMMON_SERVICE || process.env.API_URL || 'http://localhost:5002';

// Dummy data for demo
const dummyBirthApplications = [
  {
    id: '1',
    applicant_cid: '10304001001',
    first_name: 'Tashi',
    middle_name: '',
    last_name: 'Wangmo',
    date_of_birth: '2024-01-15',
    place_of_birth: 'Thimphu Hospital',
    gender: 'Female',
    father_name: 'Karma Dorji',
    father_cid: '10304001002',
    mother_name: 'Pema Lhamo',
    mother_cid: '10304001003',
    status: 'SUBMITTED',
    createdAt: '2024-01-16T10:30:00Z',
    remarks: ''
  },
  {
    id: '2',
    applicant_cid: '10304001004',
    first_name: 'Dorji',
    middle_name: '',
    last_name: 'Penjor',
    date_of_birth: '2024-02-20',
    place_of_birth: 'Paro Hospital',
    gender: 'Male',
    father_name: 'Sonam Tshering',
    father_cid: '10304001005',
    mother_name: 'Dechen Wangmo',
    mother_cid: '10304001006',
    status: 'ENDORSED',
    createdAt: '2024-02-21T14:45:00Z',
    remarks: 'Documents verified'
  },
  {
    id: '3',
    applicant_cid: '10304001007',
    first_name: 'Kinley',
    middle_name: '',
    last_name: 'Yangzom',
    date_of_birth: '2024-03-10',
    place_of_birth: 'Punakha Hospital',
    gender: 'Female',
    father_name: 'Jigme Wangchuk',
    father_cid: '10304001008',
    mother_name: 'Sonam Deki',
    mother_cid: '10304001009',
    status: 'VERIFIED',
    createdAt: '2024-03-11T09:15:00Z',
    remarks: 'Field verification completed'
  },
  {
    id: '4',
    applicant_cid: '10304001010',
    first_name: 'Namgay',
    middle_name: '',
    last_name: 'Thinley',
    date_of_birth: '2024-04-05',
    place_of_birth: 'Wangdue Hospital',
    gender: 'Male',
    father_name: 'Tshewang Dorji',
    father_cid: '10304001011',
    mother_name: 'Chimi Dema',
    mother_cid: '10304001012',
    status: 'APPROVED',
    createdAt: '2024-04-06T11:20:00Z',
    remarks: 'Approved by Registrar'
  },
  {
    id: '5',
    applicant_cid: '10304001013',
    first_name: 'Pema',
    middle_name: '',
    last_name: 'Choden',
    date_of_birth: '2024-05-12',
    place_of_birth: 'Bumthang Hospital',
    gender: 'Female',
    father_name: 'Karma Tshering',
    father_cid: '10304001014',
    mother_name: 'Yangzom Wangmo',
    mother_cid: '10304001015',
    status: 'SUBMITTED',
    createdAt: '2024-05-13T16:00:00Z',
    remarks: ''
  },
  {
    id: '6',
    applicant_cid: '10304001016',
    first_name: 'Tshering',
    middle_name: '',
    last_name: 'Dorji',
    date_of_birth: '2024-06-18',
    place_of_birth: 'Trashigang Hospital',
    gender: 'Male',
    father_name: 'Dorji Wangchuk',
    father_cid: '10304001017',
    mother_name: 'Leki Wangmo',
    mother_cid: '10304001018',
    status: 'ENDORSED',
    createdAt: '2024-06-19T08:30:00Z',
    remarks: 'Endorsed by Local Authority'
  },
  {
    id: '7',
    applicant_cid: '10304001019',
    first_name: 'Dechen',
    middle_name: '',
    last_name: 'Pemo',
    date_of_birth: '2024-07-22',
    place_of_birth: 'Samtse Hospital',
    gender: 'Female',
    father_name: 'Penjor Wangdi',
    father_cid: '10304001020',
    mother_name: 'Tshering Yangzom',
    mother_cid: '10304001021',
    status: 'VERIFIED',
    createdAt: '2024-07-23T13:45:00Z',
    remarks: 'Verification pending approval'
  },
  {
    id: '8',
    applicant_cid: '10304001022',
    first_name: 'Sonam',
    middle_name: '',
    last_name: 'Gyeltshen',
    date_of_birth: '2024-08-30',
    place_of_birth: 'Mongar Hospital',
    gender: 'Male',
    father_name: 'Karma Phuntsho',
    father_cid: '10304001023',
    mother_name: 'Choki Dema',
    mother_cid: '10304001024',
    status: 'APPROVED',
    createdAt: '2024-08-31T10:00:00Z',
    remarks: 'Certificate issued'
  }
];

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
  // Demo: Return dummy data
  // For approve page, return ENDORSED applications when VERIFIED is requested
  const targetStatus = status === 'VERIFIED' ? 'ENDORSED' : status;
  const filtered = dummyBirthApplications.filter(
    (app) => app.status === targetStatus
  );
  return {
    success: true,
    data: filtered,
    total_count: filtered.length
  };
}

export async function getSubmittedBirthApplications() {
  // Demo: Return dummy data
  const submitted = dummyBirthApplications.filter(
    (app) => app.status === 'SUBMITTED'
  );
  return {
    success: true,
    data: submitted,
    total_count: submitted.length
  };
}

export async function getMyBirthTaskList() {
  // Demo: Return dummy data for approve list (ENDORSED applications)
  const taskList = dummyBirthApplications.filter(
    (app) => app.status === 'ENDORSED'
  );
  return {
    success: true,
    data: taskList,
    total_count: taskList.length
  };
}

export async function getEndorsedBirthApplications() {
  // Demo: Return dummy data (VERIFIED status for endorse page)
  const endorsed = dummyBirthApplications.filter(
    (app) => app.status === 'VERIFIED'
  );
  return {
    success: true,
    data: endorsed,
    total_count: endorsed.length
  };
}

export async function getVerifiedBirthApplications() {
  // Demo: Return dummy data (ENDORSED status for approve page)
  const verified = dummyBirthApplications.filter(
    (app) => app.status === 'ENDORSED'
  );
  return {
    success: true,
    data: verified,
    total_count: verified.length
  };
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
  // Demo: Return success
  console.log(
    '[rejectBirthApplication] Demo: Rejecting application',
    id,
    remarks
  );
  return {
    success: true,
    data: { id, status: 'REJECTED', remarks }
  };
}

export async function updateBirthApplicationStatus(
  id: string,
  status: BirthApplicationStatus,
  remarks?: string
) {
  // Demo: Return success
  console.log(
    '[updateBirthApplicationStatus] Demo: Updating status',
    id,
    status
  );
  return {
    success: true,
    data: { id, status, remarks: remarks || '' }
  };
}

export async function assignBirthTask(applicationId: string) {
  // Demo: Return success
  console.log('[assignBirthTask] Demo: Assigning task', applicationId);
  return {
    success: true,
    data: { application_id: applicationId, assigned: true }
  };
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
  // Demo: Return dummy data
  const application = dummyBirthApplications.find((app) => app.id === id);
  if (application) {
    return { success: true, data: application };
  }
  return {
    success: false,
    error: 'Birth application not found',
    data: null
  };
}
