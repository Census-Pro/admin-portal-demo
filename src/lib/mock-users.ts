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
    permissions: Array<{
      id: string;
      name: string;
    }>;
  }>;
  ability: Array<{
    name: string;
    action: string[];
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
        permissions: [{ id: 'perm-1', name: 'manage:all' }]
      }
    ],
    ability: [
      {
        name: 'Manage All',
        action: ['create', 'read', 'update', 'delete'],
        subject: 'all'
      }
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
        permissions: [
          { id: 'perm-2', name: 'manage:birth-registration' },
          { id: 'perm-3', name: 'manage:death-registration' }
        ]
      }
    ],
    ability: [
      {
        name: 'Birth Registration',
        action: ['create', 'read', 'update'],
        subject: 'birth-registration'
      },
      {
        name: 'Death Registration',
        action: ['create', 'read', 'update'],
        subject: 'death-registration'
      },
      { name: 'Household View', action: ['read'], subject: 'household' },
      { name: 'Citizen View', action: ['read'], subject: 'citizen' }
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
        permissions: [
          { id: 'perm-4', name: 'approve:birth-registration' },
          { id: 'perm-5', name: 'approve:death-registration' }
        ]
      }
    ],
    ability: [
      {
        name: 'Birth Registration Approval',
        action: ['read', 'update'],
        subject: 'birth-registration'
      },
      {
        name: 'Death Registration Approval',
        action: ['read', 'update'],
        subject: 'death-registration'
      },
      { name: 'Household View', action: ['read'], subject: 'household' },
      { name: 'Citizen View', action: ['read'], subject: 'citizen' },
      {
        name: 'Reports Management',
        action: ['read', 'create'],
        subject: 'reports'
      }
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
        permissions: [{ id: 'perm-6', name: 'read:all' }]
      }
    ],
    ability: [{ name: 'Read All', action: ['read'], subject: 'all' }],
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
