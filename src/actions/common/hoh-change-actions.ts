'use server';

// Dummy data for demo
const dummyHohChanges = [
  {
    id: '1',
    applicationNo: 'HOH-2024-001',
    applicantCidNo: '10304003001',
    applicantIs: 'Current HOH',
    householdNo: 'HH-001',
    hohCidNo: '10304003001',
    newHohCidNo: '10304003002',
    firstName: 'Karma',
    middleName: '',
    lastName: 'Wangchuk',
    reason: 'Current HOH is elderly and unable to manage household affairs',
    status: 'SUBMITTED',
    createdAt: '2024-01-15T10:30:00Z',
    remarks: ''
  },
  {
    id: '2',
    applicationNo: 'HOH-2024-002',
    applicantCidNo: '10304003003',
    applicantIs: 'Current HOH',
    householdNo: 'HH-002',
    hohCidNo: '10304003003',
    newHohCidNo: '10304003004',
    firstName: 'Dorji',
    middleName: '',
    lastName: 'Penjor',
    reason: 'Current HOH migrating abroad',
    status: 'ENDORSED',
    createdAt: '2024-02-20T14:45:00Z',
    remarks: 'Documents verified'
  },
  {
    id: '3',
    applicationNo: 'HOH-2024-003',
    applicantCidNo: '10304003005',
    applicantIs: 'Family Member',
    householdNo: 'HH-003',
    hohCidNo: '10304003005',
    newHohCidNo: '10304003006',
    firstName: 'Leki',
    middleName: '',
    lastName: 'Dema',
    reason: 'Current HOH incapacitated due to illness',
    status: 'VERIFIED',
    createdAt: '2024-03-10T09:15:00Z',
    remarks: 'Field verification completed'
  },
  {
    id: '4',
    applicationNo: 'HOH-2024-004',
    applicantCidNo: '10304003007',
    applicantIs: 'Family Member',
    householdNo: 'HH-004',
    hohCidNo: '10304003007',
    newHohCidNo: '10304003008',
    firstName: 'Namgay',
    middleName: '',
    lastName: 'Thinley',
    reason: 'Death of current HOH',
    status: 'APPROVED',
    createdAt: '2024-04-05T11:20:00Z',
    remarks: 'Approved by Registrar'
  },
  {
    id: '5',
    applicationNo: 'HOH-2024-005',
    applicantCidNo: '10304003009',
    applicantIs: 'Current HOH',
    householdNo: 'HH-005',
    hohCidNo: '10304003009',
    newHohCidNo: '10304003010',
    firstName: 'Tshewang',
    middleName: '',
    lastName: 'Dorji',
    reason: 'Current HOH transferred to another location',
    status: 'SUBMITTED',
    createdAt: '2024-05-12T16:00:00Z',
    remarks: ''
  }
];

export async function getSubmittedHohChanges() {
  // Demo: Return dummy data
  const submitted = dummyHohChanges.filter((app) => app.status === 'SUBMITTED');
  return {
    success: true,
    data: submitted,
    total_count: submitted.length
  };
}

export async function getHohChanges(filters: any = {}) {
  // Demo: Return dummy data
  let filtered = dummyHohChanges;
  if (filters.status) {
    filtered = filtered.filter((app) => app.status === filters.status);
  }
  return {
    success: true,
    data: filtered,
    total_count: filtered.length
  };
}

export async function getHohApproveList(filters: any = {}) {
  // Demo: Return dummy data for approve list (SUBMITTED applications)
  const submitted = dummyHohChanges.filter((app) => app.status === 'SUBMITTED');
  return {
    success: true,
    data: submitted,
    total_count: submitted.length
  };
}

export async function getHohChangeByApplicationNo(applicationNo: string) {
  // Demo: Return dummy data
  const application = dummyHohChanges.find(
    (app) => app.applicationNo === applicationNo || app.id === applicationNo
  );
  if (application) {
    return { success: true, data: application };
  }
  return {
    success: false,
    error: 'HOH change application not found',
    data: null
  };
}

export async function createHohChange(data: any) {
  // Demo: Return success
  console.log('[createHohChange] Demo: Creating HOH change', data);
  return {
    success: true,
    data: {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'SUBMITTED'
    }
  };
}

export async function approveHohChange(id: string) {
  // Demo: Return success
  console.log('[approveHohChange] Demo: Approving application', id);
  return {
    success: true,
    data: { id, status: 'VERIFIED' }
  };
}

export async function rejectHohChange(applicationNo: string, remarks: string) {
  // Demo: Return success
  console.log(
    '[rejectHohChange] Demo: Rejecting application',
    applicationNo,
    remarks
  );
  return {
    success: true,
    data: { applicationNo, status: 'REJECTED', remarks }
  };
}
