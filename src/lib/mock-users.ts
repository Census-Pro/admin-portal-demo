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
    id: '5',
    fullName: 'Tsogpa',
    cidNumber: '11407002841',
    password: '11407002841',
    email: 'tsogpa@demo.gov.bt',
    mobileNo: '+97517555555',
    roleType: 'Registration Officer',
    status: 'active',
    avatar: null,
    roles: [
      {
        id: 'role-5',
        name: 'Registration Officer',
        permissions: [
          { id: 'perm-7', name: 'manage:birth-registration-verify' },
          { id: 'perm-8', name: 'manage:death-registration-verify' },
          { id: 'perm-9', name: 'manage:move-in-out' }
        ]
      }
    ],
    ability: [
      {
        name: 'Birth Registration Verify',
        action: ['manage'],
        subject: 'birth-registration-verify'
      },
      {
        name: 'Death Registration Verify',
        action: ['manage'],
        subject: 'death-registration-verify'
      },
      {
        name: 'Move In Out Relieving',
        action: ['manage'],
        subject: 'Move In Out Relieving'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    fullName: 'Gup',
    cidNumber: '10904003521',
    password: '10904003521',
    email: 'gup@demo.gov.bt',
    mobileNo: '+97517888888',
    roleType: 'Gup',
    status: 'active',
    avatar: null,
    roles: [
      {
        id: 'role-8',
        name: 'Gup',
        permissions: [
          { id: 'perm-16', name: 'manage:birth-registration-endorse' },
          { id: 'perm-18', name: 'manage:death-registration-endorse' },
          { id: 'perm-19', name: 'manage:move-in-out-receiving-endorse' }
        ]
      }
    ],
    ability: [
      {
        name: 'Birth Registration Endorse',
        action: ['manage'],
        subject: 'Birth Registration Endorse'
      },
      {
        name: 'Death Registration Endorse',
        action: ['manage'],
        subject: 'Death Registration Endorse'
      },
      {
        name: 'Move In Out Receiving Endorse',
        action: ['manage'],
        subject: 'Move In Out Receiving Endorse'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    fullName: 'Headquarters',
    cidNumber: '11302004178',
    password: '11302004178',
    email: 'hq@demo.gov.bt',
    mobileNo: '+97517999999',
    roleType: 'Headquarters',
    status: 'active',
    avatar: null,
    roles: [
      {
        id: 'role-9',
        name: 'Headquarters',
        permissions: [
          { id: 'perm-20', name: 'manage:birth-registration-approve' },
          { id: 'perm-21', name: 'manage:death-registration-approve' },
          { id: 'perm-22', name: 'manage:move-in-out-receiving-approve' },
          { id: 'perm-23', name: 'manage:cid-issuance-fresh-assessment' },
          { id: 'perm-24', name: 'manage:cid-issuance-fresh-payment' },
          { id: 'perm-25', name: 'manage:cid-issuance-fresh-approval' },
          { id: 'perm-26', name: 'manage:cid-issuance-renewal-assessment' },
          { id: 'perm-27', name: 'manage:cid-issuance-renewal-payment' },
          { id: 'perm-28', name: 'manage:cid-issuance-renewal-approval' },
          { id: 'perm-29', name: 'manage:cid-issuance-replacement-assessment' },
          { id: 'perm-30', name: 'manage:cid-issuance-replacement-payment' },
          { id: 'perm-31', name: 'manage:cid-issuance-replacement-approval' },
          { id: 'perm-32', name: 'manage:nationality-certificate-assessment' },
          { id: 'perm-33', name: 'manage:nationality-certificate-payment' },
          { id: 'perm-34', name: 'manage:nationality-certificate-approval' },
          { id: 'perm-35', name: 'manage:relation-certificate-assessment' },
          { id: 'perm-36', name: 'manage:relation-certificate-payment' },
          { id: 'perm-37', name: 'manage:relation-certificate-approval' },
          { id: 'perm-38', name: 'manage:cid-dispatch' },
          { id: 'perm-39', name: 'manage:cid-receive' }
        ]
      }
    ],
    ability: [
      {
        name: 'Birth Registration Approve',
        action: ['manage'],
        subject: 'Birth Registration Approve'
      },
      {
        name: 'Death Registration Approve',
        action: ['manage'],
        subject: 'Death Registration Approve'
      },
      {
        name: 'Move In Out Receiving Approve',
        action: ['manage'],
        subject: 'Move In Out Receiving Approve'
      },
      {
        name: 'CID Issuance Fresh Assessment',
        action: ['manage'],
        subject: 'CID Issuance Fresh Assessment'
      },
      {
        name: 'CID Issuance Fresh Payment',
        action: ['manage'],
        subject: 'CID Issuance Fresh Payment'
      },
      {
        name: 'CID Issuance Fresh Approval',
        action: ['manage'],
        subject: 'CID Issuance Fresh Approval'
      },
      {
        name: 'CID Issuance Renewal Assessment',
        action: ['manage'],
        subject: 'CID Issuance Renewal Assessment'
      },
      {
        name: 'CID Issuance Renewal Payment',
        action: ['manage'],
        subject: 'CID Issuance Renewal Payment'
      },
      {
        name: 'CID Issuance Renewal Approval',
        action: ['manage'],
        subject: 'CID Issuance Renewal Approval'
      },
      {
        name: 'CID Issuance Replacement Assessment',
        action: ['manage'],
        subject: 'CID Issuance Replacement Assessment'
      },
      {
        name: 'CID Issuance Replacement Payment',
        action: ['manage'],
        subject: 'CID Issuance Replacement Payment'
      },
      {
        name: 'CID Issuance Replacement Approval',
        action: ['manage'],
        subject: 'CID Issuance Replacement Approval'
      },
      {
        name: 'Nationality Certificate Assessment',
        action: ['manage'],
        subject: 'Nationality Certificate Assessment'
      },
      {
        name: 'Nationality Certificate Payment',
        action: ['manage'],
        subject: 'Nationality Certificate Payment'
      },
      {
        name: 'Nationality Certificate Approval',
        action: ['manage'],
        subject: 'Nationality Certificate Approval'
      },
      {
        name: 'Relation Certificate Assessment',
        action: ['manage'],
        subject: 'Relation Certificate Assessment'
      },
      {
        name: 'Relation Certificate Payment',
        action: ['manage'],
        subject: 'Relation Certificate Payment'
      },
      {
        name: 'Relation Certificate Approval',
        action: ['manage'],
        subject: 'Relation Certificate Approval'
      },
      {
        name: 'HOH Change Approve',
        action: ['manage'],
        subject: 'HOH Change Approve'
      },
      {
        name: 'CID Dispatch',
        action: ['manage'],
        subject: 'CID Dispatch'
      },
      {
        name: 'CID Receive',
        action: ['manage'],
        subject: 'CID Receive'
      }
    ],
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
