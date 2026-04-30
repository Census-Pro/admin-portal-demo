'use server';

import { instance } from '../instance';

const API_URL =
  process.env.COMMON_SERVICE || process.env.API_URL || 'http://localhost:5002';

// Dummy data for demo
const dummyDeathApplications = [
  {
    id: '1',
    deceased_cid: '10304002001',
    first_name: 'Karma',
    middle_name: '',
    last_name: 'Wangchuk',
    date_of_death: '2024-01-20',
    place_of_death: 'Thimphu Hospital',
    gender: 'Male',
    father_name: 'Dorji Tshering',
    father_cid: '10304002002',
    mother_name: 'Pema Lhamo',
    mother_cid: '10304002003',
    status: 'SUBMITTED',
    createdAt: '2024-01-21T10:30:00Z',
    remarks: ''
  },
  {
    id: '2',
    deceased_cid: '10304002004',
    first_name: 'Sonam',
    middle_name: '',
    last_name: 'Deki',
    date_of_death: '2024-02-25',
    place_of_death: 'Paro Hospital',
    gender: 'Female',
    father_name: 'Tshewang Dorji',
    father_cid: '10304002005',
    mother_name: 'Chimi Yangzom',
    mother_cid: '10304002006',
    status: 'ENDORSED',
    createdAt: '2024-02-26T14:45:00Z',
    remarks: 'Documents verified'
  },
  {
    id: '3',
    deceased_cid: '10304002007',
    first_name: 'Jigme',
    middle_name: '',
    last_name: 'Singye',
    date_of_death: '2024-03-15',
    place_of_death: 'Punakha Hospital',
    gender: 'Male',
    father_name: 'Karma Phuntsho',
    father_cid: '10304002008',
    mother_name: 'Dechen Wangmo',
    mother_cid: '10304002009',
    status: 'VERIFIED',
    createdAt: '2024-03-16T09:15:00Z',
    remarks: 'Field verification completed'
  },
  {
    id: '4',
    deceased_cid: '10304002010',
    first_name: 'Leki',
    middle_name: '',
    last_name: 'Dema',
    date_of_death: '2024-04-10',
    place_of_death: 'Wangdue Hospital',
    gender: 'Female',
    father_name: 'Penjor Wangdi',
    father_cid: '10304002011',
    mother_name: 'Tshering Yangzom',
    mother_cid: '10304002012',
    status: 'APPROVED',
    createdAt: '2024-04-11T11:20:00Z',
    remarks: 'Approved by Registrar'
  },
  {
    id: '5',
    deceased_cid: '10304002013',
    first_name: 'Dorji',
    middle_name: '',
    last_name: 'Penjor',
    date_of_death: '2024-05-18',
    place_of_death: 'Bumthang Hospital',
    gender: 'Male',
    father_name: 'Sonam Tshering',
    father_cid: '10304002014',
    mother_name: 'Yangzom Wangmo',
    mother_cid: '10304002015',
    status: 'SUBMITTED',
    createdAt: '2024-05-19T16:00:00Z',
    remarks: ''
  },
  {
    id: '6',
    deceased_cid: '10304002016',
    first_name: 'Choki',
    middle_name: '',
    last_name: 'Pemo',
    date_of_death: '2024-06-22',
    place_of_death: 'Trashigang Hospital',
    gender: 'Female',
    father_name: 'Karma Tshering',
    father_cid: '10304002017',
    mother_name: 'Leki Wangmo',
    mother_cid: '10304002018',
    status: 'ENDORSED',
    createdAt: '2024-06-23T08:30:00Z',
    remarks: 'Endorsed by Local Authority'
  },
  {
    id: '7',
    deceased_cid: '10304002019',
    first_name: 'Namgay',
    middle_name: '',
    last_name: 'Thinley',
    date_of_death: '2024-07-28',
    place_of_death: 'Samtse Hospital',
    gender: 'Male',
    father_name: 'Dorji Wangchuk',
    father_cid: '10304002020',
    mother_name: 'Tshering Yangzom',
    mother_cid: '10304002021',
    status: 'VERIFIED',
    createdAt: '2024-07-29T13:45:00Z',
    remarks: 'Verification pending approval'
  },
  {
    id: '8',
    deceased_cid: '10304002022',
    first_name: 'Pema',
    middle_name: '',
    last_name: 'Gyeltshen',
    date_of_death: '2024-08-05',
    place_of_death: 'Mongar Hospital',
    gender: 'Male',
    father_name: 'Karma Phuntsho',
    father_cid: '10304002023',
    mother_name: 'Choki Dema',
    mother_cid: '10304002024',
    status: 'APPROVED',
    createdAt: '2024-08-06T10:00:00Z',
    remarks: 'Certificate issued'
  }
];

export type DeathApplicationStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'ENDORSED'
  | 'VERIFIED'
  | 'APPROVED'
  | 'REJECTED';

export async function getUnassignedDeathApplications() {
  // Demo: Return dummy data (ENDORSED and VERIFIED applications)
  const available = dummyDeathApplications.filter(
    (app) => app.status === 'ENDORSED' || app.status === 'VERIFIED'
  );
  return {
    success: true,
    data: available,
    total_count: available.length
  };
}

export async function getDeathApplicationsByStatus(
  status: DeathApplicationStatus
) {
  // Demo: Return dummy data
  const filtered = dummyDeathApplications.filter(
    (app) => app.status === status
  );
  return {
    success: true,
    data: filtered,
    total_count: filtered.length
  };
}

export async function getSubmittedDeathApplications() {
  // Demo: Return dummy data
  const submitted = dummyDeathApplications.filter(
    (app) => app.status === 'SUBMITTED'
  );
  return {
    success: true,
    data: submitted,
    total_count: submitted.length
  };
}

export async function getMyDeathTaskList() {
  // Demo: Return dummy data for task list (SUBMITTED applications)
  const taskList = dummyDeathApplications.filter(
    (app) => app.status === 'SUBMITTED'
  );
  return {
    success: true,
    data: taskList,
    total_count: taskList.length
  };
}

export async function getEndorsedDeathApplications() {
  // Demo: Return dummy data (VERIFIED status for endorse page)
  const endorsed = dummyDeathApplications.filter(
    (app) => app.status === 'VERIFIED'
  );
  return {
    success: true,
    data: endorsed,
    total_count: endorsed.length
  };
}

export async function getDeathApplicationById(id: string) {
  // Demo: Return dummy data
  const application = dummyDeathApplications.find((app) => app.id === id);
  if (application) {
    return { success: true, data: application };
  }
  return {
    success: false,
    error: 'Death application not found',
    data: null
  };
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
  // Demo: Return success
  console.log(
    '[rejectDeathApplication] Demo: Rejecting application',
    id,
    remarks
  );
  return {
    success: true,
    data: { id, status: 'REJECTED', remarks }
  };
}

export async function updateDeathApplicationStatus(
  id: string,
  status: DeathApplicationStatus
) {
  // Demo: Return success
  console.log(
    '[updateDeathApplicationStatus] Demo: Updating status',
    id,
    status
  );
  return {
    success: true,
    data: { id, status }
  };
}

export async function assignDeathTask(applicationId: string) {
  // Demo: Return success
  console.log('[assignDeathTask] Demo: Assigning task', applicationId);
  return {
    success: true,
    data: { application_id: applicationId, assigned: true }
  };
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
