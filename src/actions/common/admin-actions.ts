'use server';

// DEMO MODE: Mock admin data matching demo users
const MOCK_ADMINS: Record<string, any> = {
  '1': {
    id: '1',
    cidNo: '10910001327',
    fullName: 'Super Admin',
    email: 'admin@demo.gov.bt',
    mobileNo: '+97517111111',
    roleType: 'SUPER_ADMIN',
    agencyName: 'Department of Civil Registration',
    officeLocationName: 'Thimphu',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  '5': {
    id: '5',
    cidNo: '11407002841',
    fullName: 'Tsogpa',
    email: 'tsogpa@demo.gov.bt',
    mobileNo: '+97517555555',
    roleType: 'Registration Officer',
    agencyName: 'Department of Civil Registration',
    officeLocationName: 'Thimphu',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  '8': {
    id: '8',
    cidNo: '10904003521',
    fullName: 'Gup',
    email: 'gup@demo.gov.bt',
    mobileNo: '+97517888888',
    roleType: 'Gup',
    agencyName: 'Gewog Administration',
    officeLocationName: 'Punakha',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  '9': {
    id: '9',
    cidNo: '11302004178',
    fullName: 'Headquarters',
    email: 'hq@demo.gov.bt',
    mobileNo: '+97517999999',
    roleType: 'Headquarters',
    agencyName: 'Department of Civil Registration',
    officeLocationName: 'Thimphu',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

const MOCK_ROLES: Record<string, any[]> = {
  '1': [
    { id: 'role-1', name: 'Super Admin', description: 'Full system access' }
  ],
  '5': [
    {
      id: 'role-5',
      name: 'Tsogpa',
      description: 'Registration verification and relieving'
    }
  ],
  '8': [{ id: 'role-8', name: 'Gup', description: 'Endorsement functions' }],
  '9': [
    {
      id: 'role-9',
      name: 'Headquarters',
      description: 'Approval and issuance functions'
    }
  ]
};

export async function getAdminById(adminId: string) {
  const admin = MOCK_ADMINS[adminId];
  if (admin) return { success: true, data: admin };
  return { success: false, error: 'User not found', data: null };
}

export async function getAdminRoles(adminId: string) {
  return { success: true, data: MOCK_ROLES[adminId] || [] };
}

export async function removeRoleFromAdmin(data: {
  adminId: string;
  roleId: string;
}) {
  return { success: true, message: 'Role removed successfully' };
}

export async function updateAdmin(
  adminId: string,
  updateData: {
    cidNo?: string;
    fullName?: string;
    roleType?: string;
    password?: string;
    officeLocationId?: string;
    agencyId?: string;
    mobileNo?: string;
    email?: string;
  }
) {
  if (MOCK_ADMINS[adminId]) {
    return { success: true, data: { ...MOCK_ADMINS[adminId], ...updateData } };
  }
  return { success: false, error: 'User not found' };
}

export async function resetAdminPassword(adminId: string, newPassword: string) {
  return { success: true, message: 'Password reset successfully' };
}
