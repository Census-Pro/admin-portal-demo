'use server';

import { instance } from '../instance';

const API_URL =
  process.env.COMMON_SERVICE || process.env.API_URL || 'http://localhost:5002';

// Original dummy data for demo
const originalBirthApplications = [
  {
    id: '1',
    applicant_cid: '10304001001',
    applicant_contact_no: '17123456',
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
    first_name: 'Tashi',
    middle_name: '',
    last_name: 'Wangmo',
    date_of_birth: '2024-01-15',
    time_of_birth: '08:30:00',
    place_of_birth: 'Thimphu Hospital',
    gender: 'Female',
    weight: 3200,
    is_mc_valid: true,
    father_name: 'Karma Dorji',
    father_cid: '10304001002',
    fathers_contact_no: '17123456',
    is_father_alive: true,
    father_approval: 'APPROVED',
    mother_name: 'Pema Lhamo',
    mother_cid: '10304001003',
    mothers_contact_no: '17654321',
    is_mother_alive: true,
    mother_approval: 'APPROVED',
    house_hold_no: 'HH-001-2024',
    house_no: 'H-123',
    tharm_no: 'TH-456',
    dzongkhag_id: '1',
    dzongkhag_name: 'Thimphu',
    gewog_id: '1',
    gewog_name: 'Chang',
    village_id: '1',
    village_name: 'Motithang',
    status: 'SUBMITTED',
    createdAt: '2024-01-16T10:30:00Z',
    remarks: ''
  },
  {
    id: '2',
    applicant_cid: '10304001004',
    applicant_contact_no: '17223344',
    applicant_is: 'mother',
    is_born_in_bhutan: true,
    is_applicant_parent: true,
    is_epis_registered: false,
    birth_country_id: '1',
    birth_country_name: 'Bhutan',
    birth_dzongkhag_id: '2',
    birth_dzongkhag_name: 'Paro',
    birth_gewog_id: '16',
    birth_gewog_name: 'Shaba',
    birth_village_id: '12',
    birth_village_name: 'Bondey',
    first_name: 'Dorji',
    middle_name: '',
    last_name: 'Penjor',
    date_of_birth: '2024-02-20',
    time_of_birth: '14:15:00',
    place_of_birth: 'Paro Hospital',
    gender: 'Male',
    weight: 3450,
    is_mc_valid: false,
    father_name: 'Sonam Tshering',
    father_cid: '10304001005',
    fathers_contact_no: '17334455',
    is_father_alive: true,
    father_approval: 'APPROVED',
    mother_name: 'Dechen Wangmo',
    mother_cid: '10304001006',
    mothers_contact_no: '17223344',
    is_mother_alive: true,
    mother_approval: 'APPROVED',
    guarantor_cid: '10304001099',
    guarantor_contact_no: '17998877',
    guarantor_approval: 'APPROVED',
    relationship: 'Uncle',
    house_hold_no: 'HH-002-2024',
    house_no: 'H-245',
    tharm_no: 'TH-789',
    dzongkhag_id: '2',
    dzongkhag_name: 'Paro',
    gewog_id: '16',
    gewog_name: 'Shaba',
    village_id: '12',
    village_name: 'Bondey',
    status: 'ENDORSED',
    createdAt: '2024-02-21T14:45:00Z',
    remarks: 'Documents verified'
  },
  {
    id: '3',
    applicant_cid: '10304001007',
    applicant_contact_no: '17445566',
    applicant_is: 'father',
    is_born_in_bhutan: true,
    is_applicant_parent: true,
    is_epis_registered: true,
    birth_country_id: '1',
    birth_country_name: 'Bhutan',
    birth_dzongkhag_id: '3',
    birth_dzongkhag_name: 'Punakha',
    birth_gewog_id: '21',
    birth_gewog_name: 'Guma',
    birth_village_id: '25',
    birth_village_name: 'Talo',
    first_name: 'Kinley',
    middle_name: '',
    last_name: 'Yangzom',
    date_of_birth: '2024-03-10',
    time_of_birth: '11:45:00',
    place_of_birth: 'Punakha Hospital',
    gender: 'Female',
    weight: 3100,
    is_mc_valid: true,
    father_name: 'Jigme Wangchuk',
    father_cid: '10304001008',
    fathers_contact_no: '17445566',
    is_father_alive: true,
    father_approval: 'APPROVED',
    mother_name: 'Sonam Deki',
    mother_cid: '10304001009',
    mothers_contact_no: '17556677',
    is_mother_alive: true,
    mother_approval: 'APPROVED',
    house_hold_no: 'HH-003-2024',
    house_no: 'H-367',
    tharm_no: 'TH-234',
    dzongkhag_id: '3',
    dzongkhag_name: 'Punakha',
    gewog_id: '21',
    gewog_name: 'Guma',
    village_id: '25',
    village_name: 'Talo',
    status: 'VERIFIED',
    createdAt: '2024-03-11T09:15:00Z',
    remarks: 'Field verification completed'
  },
  {
    id: '4',
    applicant_cid: '10304001010',
    applicant_contact_no: '17667788',
    applicant_is: 'mother',
    is_born_in_bhutan: true,
    is_applicant_parent: true,
    is_epis_registered: true,
    birth_country_id: '1',
    birth_country_name: 'Bhutan',
    birth_dzongkhag_id: '4',
    birth_dzongkhag_name: 'Wangdue Phodrang',
    birth_gewog_id: '22',
    birth_gewog_name: 'Athang',
    birth_village_id: '34',
    birth_village_name: 'Gasetsho',
    first_name: 'Namgay',
    middle_name: '',
    last_name: 'Thinley',
    date_of_birth: '2024-04-05',
    time_of_birth: '16:20:00',
    place_of_birth: 'Wangdue Hospital',
    gender: 'Male',
    weight: 3350,
    is_mc_valid: true,
    father_name: 'Tshewang Dorji',
    father_cid: '10304001011',
    fathers_contact_no: '17778899',
    is_father_alive: true,
    father_approval: 'APPROVED',
    mother_name: 'Chimi Dema',
    mother_cid: '10304001012',
    mothers_contact_no: '17667788',
    is_mother_alive: true,
    mother_approval: 'APPROVED',
    house_hold_no: 'HH-004-2024',
    house_no: 'H-489',
    tharm_no: 'TH-567',
    dzongkhag_id: '4',
    dzongkhag_name: 'Wangdue Phodrang',
    gewog_id: '22',
    gewog_name: 'Athang',
    village_id: '34',
    village_name: 'Gasetsho',
    status: 'APPROVED',
    createdAt: '2024-04-06T11:20:00Z',
    remarks: 'Approved by Registrar'
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
    status: 'SUBMITTED',
    createdAt: '2024-05-13T16:00:00Z',
    remarks: ''
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
    status: 'VERIFIED',
    createdAt: '2024-07-23T13:45:00Z',
    remarks: 'Verification pending approval'
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
    status: 'APPROVED',
    createdAt: '2024-08-31T10:00:00Z',
    remarks: 'Certificate issued'
  }
];

// Working copy that can be modified (starts as a copy of original)
let dummyBirthApplications = [...originalBirthApplications];

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
