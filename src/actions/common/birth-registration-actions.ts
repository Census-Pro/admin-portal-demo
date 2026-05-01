'use server';

import { instance } from '../instance';

const API_URL =
  process.env.COMMON_SERVICE || process.env.API_URL || 'http://localhost:5002';

// Original dummy data for demo
// FLOW TRACKING: Ugyen Namgay goes through all stages
const originalBirthApplications = [
  // STAGE 1: SUBMITTED - Appears in VERIFY page
  {
    id: '1',
    applicant_cid: '10101012345',
    applicant_contact_no: '17555999',
    applicant_is: 'father',
    is_born_in_bhutan: true,
    is_applicant_parent: true,
    is_epis_registered: true,
    birth_country_id: '1',
    birth_country_name: 'Bhutan',
    birth_dzongkhag_id: '1',
    birth_dzongkhag_name: 'Thimphu',
    birth_gewog_id: '1',
    birth_gewog_name: 'Chang',
    birth_village_id: '1',
    birth_village_name: 'Motithang',
    first_name: 'Ugyen',
    middle_name: 'Phuntsho',
    last_name: 'Namgay',
    date_of_birth: '2024-09-15',
    time_of_birth: '10:30:00',
    place_of_birth: 'Jigme Dorji Wangchuck National Referral Hospital',
    gender: 'Male',
    weight: 3250,
    is_mc_valid: true,
    father_name: 'Tenzin Dorji',
    father_cid: '10101012345',
    fathers_contact_no: '17555999',
    is_father_alive: true,
    father_approval: 'APPROVED',
    mother_name: 'Sonam Choden',
    mother_cid: '10101054321',
    mothers_contact_no: '17555888',
    is_mother_alive: true,
    mother_approval: 'APPROVED',
    house_hold_no: 'HH-FLOW-001',
    house_no: 'H-999',
    tharm_no: 'TH-999',
    dzongkhag_id: '1',
    dzongkhag_name: 'Thimphu',
    gewog_id: '1',
    gewog_name: 'Chang',
    village_id: '1',
    village_name: 'Motithang',
    status: 'SUBMITTED',
    createdAt: '2024-09-16T08:00:00Z',
    remarks: 'New application - awaiting verification'
  },
  // STAGE 2: VERIFIED - Appears in ENDORSE page
  {
    id: '2',
    applicant_cid: '10101012345',
    applicant_contact_no: '17555999',
    applicant_is: 'father',
    is_born_in_bhutan: true,
    is_applicant_parent: true,
    is_epis_registered: true,
    birth_country_id: '1',
    birth_country_name: 'Bhutan',
    birth_dzongkhag_id: '1',
    birth_dzongkhag_name: 'Thimphu',
    birth_gewog_id: '1',
    birth_gewog_name: 'Chang',
    birth_village_id: '1',
    birth_village_name: 'Motithang',
    first_name: 'Ugyen',
    middle_name: 'Phuntsho',
    last_name: 'Namgay',
    date_of_birth: '2024-09-15',
    time_of_birth: '10:30:00',
    place_of_birth: 'Jigme Dorji Wangchuck National Referral Hospital',
    gender: 'Male',
    weight: 3250,
    is_mc_valid: true,
    father_name: 'Tenzin Dorji',
    father_cid: '10101012345',
    fathers_contact_no: '17555999',
    is_father_alive: true,
    father_approval: 'APPROVED',
    mother_name: 'Sonam Choden',
    mother_cid: '10101054321',
    mothers_contact_no: '17555888',
    is_mother_alive: true,
    mother_approval: 'APPROVED',
    house_hold_no: 'HH-FLOW-001',
    house_no: 'H-999',
    tharm_no: 'TH-999',
    dzongkhag_id: '1',
    dzongkhag_name: 'Thimphu',
    gewog_id: '1',
    gewog_name: 'Chang',
    village_id: '1',
    village_name: 'Motithang',
    status: 'VERIFIED',
    createdAt: '2024-09-16T08:00:00Z',
    updatedAt: '2024-09-17T10:30:00Z',
    remarks: 'Documents verified by verifier'
  },
  // STAGE 3: ENDORSED - Appears in APPROVE page
  {
    id: '3',
    applicant_cid: '10101012345',
    applicant_contact_no: '17555999',
    applicant_is: 'father',
    is_born_in_bhutan: true,
    is_applicant_parent: true,
    is_epis_registered: true,
    birth_country_id: '1',
    birth_country_name: 'Bhutan',
    birth_dzongkhag_id: '1',
    birth_dzongkhag_name: 'Thimphu',
    birth_gewog_id: '1',
    birth_gewog_name: 'Chang',
    birth_village_id: '1',
    birth_village_name: 'Motithang',
    first_name: 'Ugyen',
    middle_name: 'Phuntsho',
    last_name: 'Namgay',
    date_of_birth: '2024-09-15',
    time_of_birth: '10:30:00',
    place_of_birth: 'Jigme Dorji Wangchuck National Referral Hospital',
    gender: 'Male',
    weight: 3250,
    is_mc_valid: true,
    father_name: 'Tenzin Dorji',
    father_cid: '10101012345',
    fathers_contact_no: '17555999',
    is_father_alive: true,
    father_approval: 'APPROVED',
    mother_name: 'Sonam Choden',
    mother_cid: '10101054321',
    mothers_contact_no: '17555888',
    is_mother_alive: true,
    mother_approval: 'APPROVED',
    house_hold_no: 'HH-FLOW-001',
    house_no: 'H-999',
    tharm_no: 'TH-999',
    dzongkhag_id: '1',
    dzongkhag_name: 'Thimphu',
    gewog_id: '1',
    gewog_name: 'Chang',
    village_id: '1',
    village_name: 'Motithang',
    status: 'ENDORSED',
    createdAt: '2024-09-16T08:00:00Z',
    updatedAt: '2024-09-18T14:15:00Z',
    remarks: 'Endorsed by local authority'
  },
  // STAGE 4: APPROVED - Appears in MY APPROVE LIST
  {
    id: '4',
    applicant_cid: '10101012345',
    applicant_contact_no: '17555999',
    applicant_is: 'father',
    is_born_in_bhutan: true,
    is_applicant_parent: true,
    is_epis_registered: true,
    birth_country_id: '1',
    birth_country_name: 'Bhutan',
    birth_dzongkhag_id: '1',
    birth_dzongkhag_name: 'Thimphu',
    birth_gewog_id: '1',
    birth_gewog_name: 'Chang',
    birth_village_id: '1',
    birth_village_name: 'Motithang',
    first_name: 'Ugyen',
    middle_name: 'Phuntsho',
    last_name: 'Namgay',
    date_of_birth: '2024-09-15',
    time_of_birth: '10:30:00',
    place_of_birth: 'Jigme Dorji Wangchuck National Referral Hospital',
    gender: 'Male',
    weight: 3250,
    is_mc_valid: true,
    father_name: 'Tenzin Dorji',
    father_cid: '10101012345',
    fathers_contact_no: '17555999',
    is_father_alive: true,
    father_approval: 'APPROVED',
    mother_name: 'Sonam Choden',
    mother_cid: '10101054321',
    mothers_contact_no: '17555888',
    is_mother_alive: true,
    mother_approval: 'APPROVED',
    house_hold_no: 'HH-FLOW-001',
    house_no: 'H-999',
    tharm_no: 'TH-999',
    dzongkhag_id: '1',
    dzongkhag_name: 'Thimphu',
    gewog_id: '1',
    gewog_name: 'Chang',
    village_id: '1',
    village_name: 'Motithang',
    status: 'ENDORSED',
    createdAt: '2024-09-16T08:00:00Z',
    updatedAt: '2024-09-19T16:45:00Z',
    remarks: 'Application approved - certificate ready for issuance',
    assigned: true
  },
  {
    id: '5',
    applicant_cid: '10304001013',
    applicant_contact_no: '17889900',
    applicant_is: 'father',
    is_born_in_bhutan: true,
    is_applicant_parent: true,
    is_epis_registered: false,
    birth_country_id: '1',
    birth_country_name: 'Bhutan',
    birth_dzongkhag_id: '5',
    birth_dzongkhag_name: 'Bumthang',
    birth_gewog_id: '23',
    birth_gewog_name: 'Chhoekhor',
    birth_village_id: '42',
    birth_village_name: 'Jakar',
    first_name: 'Pema',
    middle_name: '',
    last_name: 'Choden',
    date_of_birth: '2024-05-12',
    time_of_birth: '09:30:00',
    place_of_birth: 'Bumthang Hospital',
    gender: 'Female',
    weight: 2950,
    is_mc_valid: true,
    father_name: 'Karma Tshering',
    father_cid: '10304001014',
    fathers_contact_no: '17889900',
    is_father_alive: true,
    father_approval: 'APPROVED',
    mother_name: 'Yangzom Wangmo',
    mother_cid: '10304001015',
    mothers_contact_no: '17990011',
    is_mother_alive: true,
    mother_approval: 'APPROVED',
    house_hold_no: 'HH-005-2024',
    house_no: 'H-512',
    tharm_no: 'TH-890',
    dzongkhag_id: '5',
    dzongkhag_name: 'Bumthang',
    gewog_id: '23',
    gewog_name: 'Chhoekhor',
    village_id: '42',
    village_name: 'Jakar',
    status: 'VERIFIED',
    createdAt: '2024-05-13T16:00:00Z',
    updatedAt: '2024-05-14T09:30:00Z',
    remarks: 'Documents verified by verifier'
  },
  {
    id: '6',
    applicant_cid: '10304001016',
    applicant_contact_no: '17001122',
    applicant_is: 'mother',
    is_born_in_bhutan: true,
    is_applicant_parent: true,
    is_epis_registered: true,
    birth_country_id: '1',
    birth_country_name: 'Bhutan',
    birth_dzongkhag_id: '6',
    birth_dzongkhag_name: 'Trashigang',
    birth_gewog_id: '24',
    birth_gewog_name: 'Kanglung',
    birth_village_id: '51',
    birth_village_name: 'Yonphu',
    first_name: 'Tshering',
    middle_name: '',
    last_name: 'Dorji',
    date_of_birth: '2024-06-18',
    time_of_birth: '13:10:00',
    place_of_birth: 'Trashigang Hospital',
    gender: 'Male',
    weight: 3280,
    is_mc_valid: false,
    father_name: 'Dorji Wangchuk',
    father_cid: '10304001017',
    fathers_contact_no: '17112233',
    is_father_alive: true,
    father_approval: 'APPROVED',
    mother_name: 'Leki Wangmo',
    mother_cid: '10304001018',
    mothers_contact_no: '17001122',
    is_mother_alive: true,
    mother_approval: 'APPROVED',
    hoh_cid: '10304001050',
    hoh_contact_no: '17223456',
    hoh_approval: 'APPROVED',
    house_hold_no: 'HH-006-2024',
    house_no: 'H-634',
    tharm_no: 'TH-123',
    dzongkhag_id: '6',
    dzongkhag_name: 'Trashigang',
    gewog_id: '24',
    gewog_name: 'Kanglung',
    village_id: '51',
    village_name: 'Yonphu',
    status: 'ENDORSED',
    createdAt: '2024-06-19T08:30:00Z',
    updatedAt: '2024-06-20T10:45:00Z',
    remarks: 'Endorsed by Local Authority'
  },
  {
    id: '7',
    applicant_cid: '10304001019',
    applicant_contact_no: '17334567',
    applicant_is: 'father',
    is_born_in_bhutan: false,
    is_applicant_parent: true,
    is_epis_registered: false,
    birth_country_id: '2',
    birth_country_name: 'India',
    birth_city_id: '1',
    birth_city_name: 'Siliguri',
    first_name: 'Dechen',
    middle_name: '',
    last_name: 'Pemo',
    date_of_birth: '2024-07-22',
    time_of_birth: '18:45:00',
    place_of_birth: 'Siliguri Hospital',
    gender: 'Female',
    weight: 3050,
    is_mc_valid: true,
    father_name: 'Penjor Wangdi',
    father_cid: '10304001020',
    fathers_contact_no: '17334567',
    is_father_alive: true,
    father_approval: 'APPROVED',
    mother_name: 'Tshering Yangzom',
    mother_cid: '10304001021',
    mothers_contact_no: '17445678',
    is_mother_alive: true,
    mother_approval: 'APPROVED',
    house_hold_no: 'HH-007-2024',
    house_no: 'H-756',
    dzongkhag_id: '7',
    dzongkhag_name: 'Samtse',
    gewog_id: '25',
    gewog_name: 'Samtse',
    village_id: '60',
    village_name: 'Samtse Town',
    status: 'SUBMITTED',
    createdAt: '2024-07-23T13:45:00Z',
    remarks: 'New application - awaiting verification'
  },
  {
    id: '8',
    applicant_cid: '10304001022',
    applicant_contact_no: '17556789',
    applicant_is: 'mother',
    is_born_in_bhutan: true,
    is_applicant_parent: true,
    is_epis_registered: true,
    birth_country_id: '1',
    birth_country_name: 'Bhutan',
    birth_dzongkhag_id: '8',
    birth_dzongkhag_name: 'Mongar',
    birth_gewog_id: '26',
    birth_gewog_name: 'Mongar',
    birth_village_id: '68',
    birth_village_name: 'Mongar Town',
    first_name: 'Sonam',
    middle_name: 'Jamyang',
    last_name: 'Gyeltshen',
    date_of_birth: '2024-08-30',
    time_of_birth: '07:15:00',
    place_of_birth: 'Mongar Hospital',
    gender: 'Male',
    weight: 3400,
    is_mc_valid: true,
    father_name: 'Karma Phuntsho',
    father_cid: '10304001023',
    fathers_contact_no: '17667890',
    is_father_alive: true,
    father_approval: 'APPROVED',
    mother_name: 'Choki Dema',
    mother_cid: '10304001024',
    mothers_contact_no: '17556789',
    is_mother_alive: true,
    mother_approval: 'APPROVED',
    house_hold_no: 'HH-008-2024',
    house_no: 'H-878',
    tharm_no: 'TH-345',
    dzongkhag_id: '8',
    dzongkhag_name: 'Mongar',
    gewog_id: '26',
    gewog_name: 'Mongar',
    village_id: '68',
    village_name: 'Mongar Town',
    status: 'ENDORSED',
    createdAt: '2024-08-31T10:00:00Z',
    remarks: 'Certificate issued',
    assigned: true
  },
  {
    id: '9',
    applicant_cid: '10501002031',
    applicant_contact_no: '17778899',
    applicant_is: 'father',
    is_born_in_bhutan: true,
    is_applicant_parent: true,
    is_epis_registered: true,
    birth_country_id: '1',
    birth_country_name: 'Bhutan',
    birth_dzongkhag_id: '3',
    birth_dzongkhag_name: 'Punakha',
    birth_gewog_id: '12',
    birth_gewog_name: 'Toewang',
    birth_village_id: '22',
    birth_village_name: 'Lobeysa',
    first_name: 'Kinley',
    middle_name: '',
    last_name: 'Wangchuk',
    date_of_birth: '2024-10-05',
    time_of_birth: '11:20:00',
    place_of_birth: 'Punakha Hospital',
    gender: 'Male',
    weight: 3100,
    is_mc_valid: true,
    father_name: 'Tshewang Dorji',
    father_cid: '10501002032',
    fathers_contact_no: '17778899',
    is_father_alive: true,
    father_approval: 'APPROVED',
    mother_name: 'Karma Dema',
    mother_cid: '10501002033',
    mothers_contact_no: '17889900',
    is_mother_alive: true,
    mother_approval: 'APPROVED',
    house_hold_no: 'HH-009-2024',
    house_no: 'H-101',
    tharm_no: 'TH-202',
    dzongkhag_id: '3',
    dzongkhag_name: 'Punakha',
    gewog_id: '12',
    gewog_name: 'Toewang',
    village_id: '22',
    village_name: 'Lobeysa',
    status: 'ENDORSED',
    createdAt: '2024-10-06T09:00:00Z',
    updatedAt: '2024-10-08T11:00:00Z',
    remarks: 'Endorsed by Local Authority',
    assigned: true
  },
  {
    id: '10',
    applicant_cid: '10202003044',
    applicant_contact_no: '17665544',
    applicant_is: 'mother',
    is_born_in_bhutan: true,
    is_applicant_parent: true,
    is_epis_registered: false,
    birth_country_id: '1',
    birth_country_name: 'Bhutan',
    birth_dzongkhag_id: '4',
    birth_dzongkhag_name: 'Trongsa',
    birth_gewog_id: '18',
    birth_gewog_name: 'Trongsa',
    birth_village_id: '35',
    birth_village_name: 'Trongsa Town',
    first_name: 'Tenzin',
    middle_name: 'Lhamo',
    last_name: 'Zangmo',
    date_of_birth: '2024-11-20',
    time_of_birth: '08:45:00',
    place_of_birth: 'Trongsa Hospital',
    gender: 'Female',
    weight: 2870,
    is_mc_valid: true,
    father_name: 'Ugyen Tshering',
    father_cid: '10202003045',
    fathers_contact_no: '17554433',
    is_father_alive: true,
    father_approval: 'APPROVED',
    mother_name: 'Pema Seldon',
    mother_cid: '10202003046',
    mothers_contact_no: '17665544',
    is_mother_alive: true,
    mother_approval: 'APPROVED',
    house_hold_no: 'HH-010-2024',
    house_no: 'H-203',
    tharm_no: 'TH-404',
    dzongkhag_id: '4',
    dzongkhag_name: 'Trongsa',
    gewog_id: '18',
    gewog_name: 'Trongsa',
    village_id: '35',
    village_name: 'Trongsa Town',
    status: 'ENDORSED',
    createdAt: '2024-11-21T07:30:00Z',
    updatedAt: '2024-11-22T13:15:00Z',
    remarks: 'Endorsed by Local Authority',
    assigned: true
  }
];

// Global store to persist data across serverless function calls
const globalStore = globalThis as any;
// Always re-initialize to pick up any changes to originalBirthApplications
globalStore.birthApplicationsData = [...originalBirthApplications];

// Working copy that can be modified
let dummyBirthApplications = globalStore.birthApplicationsData;

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
    (app: any) => app.status === targetStatus
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
    (app: any) => app.status === 'SUBMITTED'
  );
  return {
    success: true,
    data: submitted,
    total_count: submitted.length
  };
}

export async function getMyBirthTaskList() {
  // Demo: Return dummy data for approve list (ENDORSED applications - assigned for approval)
  const taskList = dummyBirthApplications.filter(
    (app: any) => app.status === 'ENDORSED' && app.assigned === true
  );
  return {
    success: true,
    data: taskList,
    total_count: taskList.length
  };
}

export async function getEndorsedBirthApplications() {
  // Demo: Return dummy data (ENDORSED status for approve page, not yet assigned)
  const endorsed = dummyBirthApplications.filter(
    (app: any) => app.status === 'ENDORSED' && !app.assigned
  );
  return {
    success: true,
    data: endorsed,
    total_count: endorsed.length
  };
}

export async function getVerifiedBirthApplications() {
  // Demo: Return dummy data (VERIFIED status for endorse page)
  const verified = dummyBirthApplications.filter(
    (app: any) => app.status === 'VERIFIED'
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
  // Demo: Update the dummy data status
  console.log(
    '[rejectBirthApplication] Demo: Rejecting application',
    id,
    remarks
  );

  // Find and update the application in dummy data
  const applicationIndex = dummyBirthApplications.findIndex(
    (app: any) => app.id === id
  );
  if (applicationIndex !== -1) {
    dummyBirthApplications[applicationIndex].status = 'REJECTED';
    dummyBirthApplications[applicationIndex].updatedAt =
      new Date().toISOString();
    dummyBirthApplications[applicationIndex].remarks = remarks;
  }

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
  // Demo: Update the dummy data status
  console.log(
    '[updateBirthApplicationStatus] Demo: Updating status',
    id,
    status
  );

  // Find and update the application in dummy data
  const applicationIndex = dummyBirthApplications.findIndex(
    (app: any) => app.id === id
  );
  if (applicationIndex !== -1) {
    dummyBirthApplications[applicationIndex].status = status;
    dummyBirthApplications[applicationIndex].updatedAt =
      new Date().toISOString();
    if (remarks) {
      dummyBirthApplications[applicationIndex].remarks = remarks;
    }
  }

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
  const application = dummyBirthApplications.find((app: any) => app.id === id);
  if (application) {
    return { success: true, data: application };
  }
  return {
    success: false,
    error: 'Birth application not found',
    data: null
  };
}

export async function resetBirthApplicationsData() {
  // Reset to original data
  dummyBirthApplications.length = 0; // Clear current array
  dummyBirthApplications.push(...originalBirthApplications); // Restore original data

  // Also update global store
  const globalStore = globalThis as any;
  globalStore.birthApplicationsData = dummyBirthApplications;

  return {
    success: true,
    message: 'All birth applications data has been reset to original state'
  };
}
