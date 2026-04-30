/**
 * Mock user data for demo authentication
 * No backend service required - pure frontend demo
 */

export interface MockUser {
  id: string;
  fullName: string;
  cidNumber: string;
  password: string;
  email: string;
  mobileNo: string;
  roleType: string;
  status: string;
  avatar: string | null;
  roles: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  ability: Array<{
    action: string | string[];
    subject: string | string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

export const DEMO_USERS: MockUser[] = [
  {
    id: '1',
    fullName: 'Super Admin',
    cidNumber: '10910001327',
    password: '10910001327',
    email: 'admin@demo.gov.bt',
    mobileNo: '+97517111111',
    roleType: 'SUPER_ADMIN',
    status: 'active',
    avatar: null,
    roles: [
      {
        id: 'role-1',
        name: 'Super Admin',
        description: 'Full system access with all permissions'
      }
    ],
    ability: [
      { action: ['create', 'read', 'update', 'delete'], subject: 'all' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    fullName: 'Registration Officer',
    cidNumber: '22222222222',
    password: 'officer123',
    email: 'officer@demo.gov.bt',
    mobileNo: '+97517222222',
    roleType: 'Registration Officer',
    status: 'active',
    avatar: null,
    roles: [
      {
        id: 'role-2',
        name: 'Registration Officer',
        description: 'Can register births and deaths'
      }
    ],
    ability: [
      { action: ['create', 'read', 'update'], subject: 'birth-registration' },
      { action: ['create', 'read', 'update'], subject: 'death-registration' },
      { action: 'read', subject: 'household' },
      { action: 'read', subject: 'citizen' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    fullName: 'Approval Officer',
    cidNumber: '33333333333',
    password: 'approval123',
    email: 'approval@demo.gov.bt',
    mobileNo: '+97517333333',
    roleType: 'Approval Officer',
    status: 'active',
    avatar: null,
    roles: [
      {
        id: 'role-3',
        name: 'Approval Officer',
        description: 'Can approve or reject registrations'
      }
    ],
    ability: [
      { action: ['read', 'update'], subject: 'birth-registration' },
      { action: ['read', 'update'], subject: 'death-registration' },
      { action: 'read', subject: 'household' },
      { action: 'read', subject: 'citizen' },
      { action: ['read', 'create'], subject: 'reports' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    fullName: 'Viewer User',
    cidNumber: '44444444444',
    password: 'viewer123',
    email: 'viewer@demo.gov.bt',
    mobileNo: '+97517444444',
    roleType: 'Viewer',
    status: 'active',
    avatar: null,
    roles: [
      {
        id: 'role-4',
        name: 'Viewer',
        description: 'Read-only access to all modules'
      }
    ],
    ability: [{ action: 'read', subject: 'all' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Authenticate a user with CID and password
 * @param cidNumber - User's CID number
 * @param password - User's password
 * @returns Authenticated user or null if credentials are invalid
 */
export function authenticateUser(
  cidNumber: string,
  password: string
): MockUser | null {
  const user = DEMO_USERS.find(
    (u) => u.cidNumber === cidNumber && u.password === password
  );
  return user || null;
}

/**
 * Get a user by CID number
 * @param cidNumber - User's CID number
 * @returns User or null if not found
 */
export function getUserByCid(cidNumber: string): MockUser | null {
  const user = DEMO_USERS.find((u) => u.cidNumber === cidNumber);
  return user || null;
}
