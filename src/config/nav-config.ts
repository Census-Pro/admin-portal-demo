import { NavItem } from '@/types';
import * as PERMS from './permissions';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
    subject: 'Dashboard', // For ability-based filtering
    // Everyone with dashboard access can view
    access: {
      permissions: [PERMS.MANAGE_ALL, PERMS.VIEW_DASHBOARD]
    }
  },
  {
    title: 'User',
    url: '/dashboard/user',
    icon: 'teams',
    isActive: false,
    items: [],
    subject: 'Admin', // For ability-based filtering
    // Super Admin and Admin can manage users
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.VIEW_USERS,
        PERMS.MANAGE_USERS,
        PERMS.EDIT_USERS
      ]
    }
  },
  {
    title: 'Masters',
    url: '#',
    icon: 'billing',
    isActive: true,
    superAdminOnly: true, // Only visible to SUPER_ADMIN
    items: [
      {
        title: 'Agencies',
        url: '/dashboard/agencies',
        shortcut: ['a', 'g'],
        // Only Super Admin can manage agencies
        access: {
          permissions: [PERMS.MANAGE_ALL]
        }
      },
      {
        title: 'Office Locations',
        url: '/dashboard/office-locations',
        shortcut: ['o', 'l'],
        // Only Super Admin can manage office locations
        access: {
          permissions: [PERMS.MANAGE_ALL]
        }
      },
      {
        title: 'Relationships',
        url: '/dashboard/relationship-types',
        shortcut: ['r', 'l'],
        access: {
          permissions: [PERMS.MANAGE_ALL]
        }
      },
      {
        title: 'Countries',
        url: '/dashboard/countries',
        shortcut: ['c', 'u'],
        access: {
          permissions: [PERMS.MANAGE_ALL]
        }
      },
      {
        title: 'Dzongkhags',
        url: '/dashboard/dzongkhags',
        shortcut: ['d', 'z'],
        access: {
          permissions: [PERMS.MANAGE_ALL]
        }
      },
      {
        title: 'Gewogs',
        url: '/dashboard/gewogs',
        shortcut: ['g', 'w'],
        access: {
          permissions: [PERMS.MANAGE_ALL]
        }
      },
      {
        title: 'Cities',
        url: '/dashboard/cities',
        shortcut: ['c', 't'],
        access: {
          permissions: [PERMS.MANAGE_ALL]
        }
      },
      {
        title: 'Genders',
        url: '/dashboard/genders',
        shortcut: ['g', 'n'],
        access: {
          permissions: [PERMS.MANAGE_ALL]
        }
      },
      {
        title: 'Marital Status',
        url: '/dashboard/marital-status',
        shortcut: ['m', 's'],
        access: {
          permissions: [PERMS.MANAGE_ALL]
        }
      },
      {
        title: 'Literacy Status',
        url: '/dashboard/literacy-status',
        shortcut: ['l', 's'],
        access: {
          permissions: [PERMS.MANAGE_ALL]
        }
      },
      {
        title: 'Census Status',
        url: '/dashboard/census-status',
        shortcut: ['c', 's'],
        access: {
          permissions: [PERMS.MANAGE_ALL]
        }
      },
      {
        title: 'Naturalization Types',
        url: '/dashboard/naturalization-types',
        shortcut: ['n', 't'],
        access: {
          permissions: [PERMS.MANAGE_ALL]
        }
      },
      {
        title: 'Regularization Types',
        url: '/dashboard/regularization-types',
        shortcut: ['r', 't'],
        access: {
          permissions: [PERMS.MANAGE_ALL]
        }
      },
      {
        title: 'Certificate Purposes',
        url: '/dashboard/relationship-certificate-purposes',
        shortcut: ['c', 'p'],
        access: {
          permissions: [PERMS.MANAGE_ALL]
        }
      }
    ],
    // Only Super Admin can access Masters section
    access: {
      permissions: [PERMS.MANAGE_ALL]
    }
  },
  {
    title: 'Roles & Permission',
    url: '#',
    icon: 'shield',
    isActive: true,
    superAdminOnly: true, // Only visible to SUPER_ADMIN
    items: [
      {
        title: 'Roles',
        url: '/dashboard/roles',
        shortcut: ['r', 'o'],
        // Only Super Admin can manage roles
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_ROLES, PERMS.VIEW_ROLES]
        }
      },
      {
        title: 'Permissions',
        url: '/dashboard/permissions',
        shortcut: ['p', 'm'],
        // Only Super Admin can manage permissions
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_PERMISSIONS,
            PERMS.VIEW_PERMISSIONS
          ]
        }
      }
    ],
    // Only Super Admin can access Roles & Permission section
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.MANAGE_ROLES,
        PERMS.MANAGE_PERMISSIONS
      ]
    }
  },
  {
    title: 'Birth Registration',
    url: '/dashboard/birth-registration',
    icon: 'baby',
    isActive: false,
    items: [],
    subject: 'Birth Registration', // For ability-based filtering
    // Super Admin, Admin, and Operators can view birth registration
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.VIEW_BIRTH_REGISTRATION,
        PERMS.MANAGE_BIRTH_REGISTRATION,
        PERMS.VERIFY_BIRTH_REGISTRATION,
        PERMS.APPROVE_BIRTH_REGISTRATION
      ]
    }
  },
  {
    title: 'CID Issuance',
    url: '/dashboard/cid-issuance',
    icon: 'idCard',
    isActive: false,
    subject: 'CID Issuance', // For ability-based filtering
    items: [
      {
        title: 'New CID',
        url: '/dashboard/cid-issuance/new',
        shortcut: ['c', 'n'],
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_CID_ISSUANCE,
            PERMS.CREATE_CID_ISSUANCE,
            PERMS.MANAGE_CID_ISSUANCE
          ]
        }
      },
      {
        title: 'Replacement',
        url: '/dashboard/cid-issuance/replacement',
        shortcut: ['c', 'r'],
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_CID_ISSUANCE,
            PERMS.CREATE_CID_ISSUANCE,
            PERMS.MANAGE_CID_ISSUANCE
          ]
        }
      },
      {
        title: 'Renewal',
        url: '/dashboard/cid-issuance/renewal',
        shortcut: ['c', 'e'],
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_CID_ISSUANCE,
            PERMS.CREATE_CID_ISSUANCE,
            PERMS.MANAGE_CID_ISSUANCE
          ]
        }
      }
    ],
    // Super Admin, Admin, and Operators can view CID issuance
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.VIEW_CID_ISSUANCE,
        PERMS.MANAGE_CID_ISSUANCE,
        PERMS.VERIFY_CID_ISSUANCE,
        PERMS.APPROVE_CID_ISSUANCE
      ]
    }
  },
  {
    title: 'Move In/Move Out',
    url: '/dashboard/move-in-out',
    icon: 'home',
    isActive: false,
    items: [],
    subject: 'Move In/Move Out', // For ability-based filtering
    // Super Admin, Admin, and Operators can view move in/out
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.VIEW_MOVE_IN_OUT,
        PERMS.MANAGE_MOVE_IN_OUT,
        PERMS.VERIFY_MOVE_IN_OUT,
        PERMS.APPROVE_MOVE_IN_OUT
      ]
    }
  },

  {
    title: 'Naturalization/Regularization',
    url: '/dashboard/naturalization',
    icon: 'certificate',
    isActive: false,
    items: [],
    subject: 'Naturalization', // For ability-based filtering
    // Super Admin, Admin, and Operators can view naturalization
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.VIEW_NATURALIZATION,
        PERMS.MANAGE_NATURALIZATION,
        PERMS.VERIFY_NATURALIZATION,
        PERMS.APPROVE_NATURALIZATION
      ]
    }
  },
  {
    title: 'Death Registration',
    url: '/dashboard/death-registration',
    icon: 'grave',
    isActive: false,
    items: [],
    subject: 'Death Registration', // For ability-based filtering
    // Super Admin, Admin, and Operators can view death registration
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.VIEW_DEATH_REGISTRATION,
        PERMS.MANAGE_DEATH_REGISTRATION,
        PERMS.VERIFY_DEATH_REGISTRATION,
        PERMS.APPROVE_DEATH_REGISTRATION
      ]
    }
  }
];
