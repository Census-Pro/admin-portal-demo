export interface User {
  id: string;
  name?: string;
  cidNo?: string;
  email?: string;
  role: string;
  agencyName?: string;
  officeLocationName?: string;
  status?: 'Active' | 'Inactive' | 'Pending';
  lastActive?: string;
}

export interface BackendAdmin {
  id: string;
  cidNo?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  roleType?: string;
  agencyName?: string;
  agency?: { name?: string; agencyName?: string };
  officeLocationName?: string;
  officeLocation?: { name?: string; locationName?: string };
}

export interface CreateUserFormData {
  cidNo: string;
  password: string;
  officeLocationId: string;
  agencyId: string;
  mobileNo: string;
  email: string;
}
