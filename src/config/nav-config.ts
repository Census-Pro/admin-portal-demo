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
    subject: 'User', // For ability-based filtering (changed from 'Admin' to match backend)
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
    subject: 'Masters', // For ability-based filtering
    items: [
      {
        title: 'Agencies',
        url: '/dashboard/agencies',
        shortcut: ['a', 'g'],
        subject: 'Agencies',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_AGENCIES,
            PERMS.MANAGE_AGENCIES
          ]
        }
      },
      {
        title: 'Office Locations',
        url: '/dashboard/office-locations',
        shortcut: ['o', 'l'],
        subject: 'Office Locations',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_OFFICE_LOCATIONS,
            PERMS.MANAGE_OFFICE_LOCATIONS
          ]
        }
      },
      {
        title: 'Relationships',
        url: '/dashboard/relationship-types',
        shortcut: ['r', 'l'],
        subject: 'Relationship Types',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_RELATIONSHIP_TYPES,
            PERMS.MANAGE_RELATIONSHIP_TYPES
          ]
        }
      },
      {
        title: 'Countries',
        url: '/dashboard/countries',
        shortcut: ['c', 'u'],
        subject: 'Countries',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_COUNTRIES,
            PERMS.MANAGE_COUNTRIES
          ]
        }
      },
      {
        title: 'Dzongkhags',
        url: '/dashboard/dzongkhags',
        shortcut: ['d', 'z'],
        subject: 'Dzongkhags',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_DZONGKHAGS,
            PERMS.MANAGE_DZONGKHAGS
          ]
        }
      },
      {
        title: 'Gewogs',
        url: '/dashboard/gewogs',
        shortcut: ['g', 'w'],
        subject: 'Gewogs',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_GEWOGS,
            PERMS.MANAGE_GEWOGS
          ]
        }
      },
      {
        title: 'Cities',
        url: '/dashboard/cities',
        shortcut: ['c', 't'],
        subject: 'Cities',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_CITIES,
            PERMS.MANAGE_CITIES
          ]
        }
      },
      {
        title: 'Genders',
        url: '/dashboard/genders',
        shortcut: ['g', 'n'],
        subject: 'Genders',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_GENDERS,
            PERMS.MANAGE_GENDERS
          ]
        }
      },
      {
        title: 'Marital Status',
        url: '/dashboard/marital-status',
        shortcut: ['m', 's'],
        subject: 'Marital Status',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_MARITAL_STATUS,
            PERMS.MANAGE_MARITAL_STATUS
          ]
        }
      },
      {
        title: 'Literacy Status',
        url: '/dashboard/literacy-status',
        shortcut: ['l', 's'],
        subject: 'Literacy Status',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_LITERACY_STATUS,
            PERMS.MANAGE_LITERACY_STATUS
          ]
        }
      },
      {
        title: 'Census Status',
        url: '/dashboard/census-status',
        shortcut: ['c', 's'],
        subject: 'Census Status',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_CENSUS_STATUS,
            PERMS.MANAGE_CENSUS_STATUS
          ]
        }
      },
      {
        title: 'Naturalization Types',
        url: '/dashboard/naturalization-types',
        shortcut: ['n', 't'],
        subject: 'Naturalization Types',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_NATURALIZATION_TYPES,
            PERMS.MANAGE_NATURALIZATION_TYPES
          ]
        }
      },
      {
        title: 'Regularization Types',
        url: '/dashboard/regularization-types',
        shortcut: ['r', 't'],
        subject: 'Regularization Types',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_REGULARIZATION_TYPES,
            PERMS.MANAGE_REGULARIZATION_TYPES
          ]
        }
      },
      {
        title: 'Certificate Purposes',
        url: '/dashboard/relationship-certificate-purposes',
        shortcut: ['c', 'p'],
        subject: 'Relationship Certificate Purposes',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.VIEW_RELATIONSHIP_CERTIFICATE_PURPOSES,
            PERMS.MANAGE_RELATIONSHIP_CERTIFICATE_PURPOSES
          ]
        }
      }
    ],
    // Parent Masters section - visible if user has access to any master data
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.VIEW_AGENCIES,
        PERMS.VIEW_OFFICE_LOCATIONS,
        PERMS.VIEW_RELATIONSHIP_TYPES,
        PERMS.VIEW_COUNTRIES,
        PERMS.VIEW_DZONGKHAGS,
        PERMS.VIEW_GEWOGS,
        PERMS.VIEW_CITIES,
        PERMS.VIEW_GENDERS,
        PERMS.VIEW_MARITAL_STATUS,
        PERMS.VIEW_LITERACY_STATUS,
        PERMS.VIEW_CENSUS_STATUS,
        PERMS.VIEW_NATURALIZATION_TYPES,
        PERMS.VIEW_REGULARIZATION_TYPES,
        PERMS.VIEW_RELATIONSHIP_CERTIFICATE_PURPOSES
      ]
    }
  },
  {
    title: 'Roles & Permission',
    url: '#',
    icon: 'shield',
    isActive: true,
    subject: 'Roles & Permissions', // For ability-based filtering
    items: [
      {
        title: 'Roles',
        url: '/dashboard/roles',
        shortcut: ['r', 'o'],
        subject: 'Roles',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_ROLES, PERMS.VIEW_ROLES]
        }
      },
      {
        title: 'Permissions',
        url: '/dashboard/permissions',
        shortcut: ['p', 'm'],
        subject: 'Permissions',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_PERMISSIONS,
            PERMS.VIEW_PERMISSIONS
          ]
        }
      }
    ],
    // Parent Roles & Permissions section - visible if user has access to roles or permissions
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.MANAGE_ROLES,
        PERMS.VIEW_ROLES,
        PERMS.MANAGE_PERMISSIONS,
        PERMS.VIEW_PERMISSIONS
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
