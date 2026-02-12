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
        PERMS.MANAGE_USERS,
        PERMS.VIEW_USERS,
        PERMS.CREATE_USERS,
        PERMS.EDIT_USERS,
        PERMS.DELETE_USERS
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
            PERMS.MANAGE_AGENCIES,
            PERMS.VIEW_AGENCIES,
            PERMS.CREATE_AGENCIES,
            PERMS.EDIT_AGENCIES,
            PERMS.DELETE_AGENCIES
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
            PERMS.MANAGE_OFFICE_LOCATIONS,
            PERMS.VIEW_OFFICE_LOCATIONS,
            PERMS.CREATE_OFFICE_LOCATIONS,
            PERMS.EDIT_OFFICE_LOCATIONS,
            PERMS.DELETE_OFFICE_LOCATIONS
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
            PERMS.MANAGE_RELATIONSHIP_TYPES,
            PERMS.VIEW_RELATIONSHIP_TYPES,
            PERMS.CREATE_RELATIONSHIP_TYPES,
            PERMS.EDIT_RELATIONSHIP_TYPES,
            PERMS.DELETE_RELATIONSHIP_TYPES
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
            PERMS.MANAGE_COUNTRIES,
            PERMS.VIEW_COUNTRIES,
            PERMS.CREATE_COUNTRIES,
            PERMS.EDIT_COUNTRIES,
            PERMS.DELETE_COUNTRIES
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
            PERMS.MANAGE_DZONGKHAGS,
            PERMS.VIEW_DZONGKHAGS,
            PERMS.CREATE_DZONGKHAGS,
            PERMS.EDIT_DZONGKHAGS,
            PERMS.DELETE_DZONGKHAGS
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
            PERMS.MANAGE_GEWOGS,
            PERMS.VIEW_GEWOGS,
            PERMS.CREATE_GEWOGS,
            PERMS.EDIT_GEWOGS,
            PERMS.DELETE_GEWOGS
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
            PERMS.MANAGE_CITIES,
            PERMS.VIEW_CITIES,
            PERMS.CREATE_CITIES,
            PERMS.EDIT_CITIES,
            PERMS.DELETE_CITIES
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
            PERMS.MANAGE_GENDERS,
            PERMS.VIEW_GENDERS,
            PERMS.CREATE_GENDERS,
            PERMS.EDIT_GENDERS,
            PERMS.DELETE_GENDERS
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
            PERMS.MANAGE_MARITAL_STATUS,
            PERMS.VIEW_MARITAL_STATUS,
            PERMS.CREATE_MARITAL_STATUS,
            PERMS.EDIT_MARITAL_STATUS,
            PERMS.DELETE_MARITAL_STATUS
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
            PERMS.MANAGE_LITERACY_STATUS,
            PERMS.VIEW_LITERACY_STATUS,
            PERMS.CREATE_LITERACY_STATUS,
            PERMS.EDIT_LITERACY_STATUS,
            PERMS.DELETE_LITERACY_STATUS
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
            PERMS.MANAGE_CENSUS_STATUS,
            PERMS.VIEW_CENSUS_STATUS,
            PERMS.CREATE_CENSUS_STATUS,
            PERMS.EDIT_CENSUS_STATUS,
            PERMS.DELETE_CENSUS_STATUS
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
            PERMS.MANAGE_NATURALIZATION_TYPES,
            PERMS.VIEW_NATURALIZATION_TYPES,
            PERMS.CREATE_NATURALIZATION_TYPES,
            PERMS.EDIT_NATURALIZATION_TYPES,
            PERMS.DELETE_NATURALIZATION_TYPES
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
            PERMS.MANAGE_REGULARIZATION_TYPES,
            PERMS.VIEW_REGULARIZATION_TYPES,
            PERMS.CREATE_REGULARIZATION_TYPES,
            PERMS.EDIT_REGULARIZATION_TYPES,
            PERMS.DELETE_REGULARIZATION_TYPES
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
            PERMS.MANAGE_RELATIONSHIP_CERTIFICATE_PURPOSES,
            PERMS.VIEW_RELATIONSHIP_CERTIFICATE_PURPOSES,
            PERMS.CREATE_RELATIONSHIP_CERTIFICATE_PURPOSES,
            PERMS.EDIT_RELATIONSHIP_CERTIFICATE_PURPOSES,
            PERMS.DELETE_RELATIONSHIP_CERTIFICATE_PURPOSES
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
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_ROLES,
            PERMS.VIEW_ROLES,
            PERMS.CREATE_ROLES,
            PERMS.EDIT_ROLES,
            PERMS.DELETE_ROLES
          ]
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
            PERMS.VIEW_PERMISSIONS,
            PERMS.CREATE_PERMISSIONS,
            PERMS.EDIT_PERMISSIONS,
            PERMS.DELETE_PERMISSIONS
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
    url: '#',
    icon: 'baby',
    isActive: false,
    subject: 'Birth Registration', // For ability-based filtering
    items: [
      {
        title: 'Endorse',
        url: '/dashboard/birth-registration/endorse',
        subject: 'Birth Registration Endorse',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.ENDORSE_BIRTH_REGISTRATION]
        }
      },
      {
        title: 'Verify',
        url: '/dashboard/birth-registration/verify',
        subject: 'Birth Registration Verify',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.VERIFY_BIRTH_REGISTRATION]
        }
      },
      {
        title: 'Approve',
        url: '/dashboard/birth-registration/approve',
        subject: 'Birth Registration Approve',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.APPROVE_BIRTH_REGISTRATION]
        }
      }
    ],
    // Super Admin, Admin, and Operators can view birth registration
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.MANAGE_BIRTH_REGISTRATION,
        PERMS.VIEW_BIRTH_REGISTRATION,
        PERMS.CREATE_BIRTH_REGISTRATION,
        PERMS.EDIT_BIRTH_REGISTRATION,
        PERMS.DELETE_BIRTH_REGISTRATION,
        PERMS.ENDORSE_BIRTH_REGISTRATION,
        PERMS.VERIFY_BIRTH_REGISTRATION,
        PERMS.APPROVE_BIRTH_REGISTRATION
      ]
    }
  },
  {
    title: 'Death Registration',
    url: '#',
    icon: 'grave',
    isActive: false,
    subject: 'Death Registration', // For ability-based filtering
    items: [
      {
        title: 'Endorse',
        url: '/dashboard/death-registration/endorse',
        subject: 'Death Registration Endorse',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.ENDORSE_DEATH_REGISTRATION]
        }
      },
      {
        title: 'Verify',
        url: '/dashboard/death-registration/verify',
        subject: 'Death Registration Verify',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.VERIFY_DEATH_REGISTRATION]
        }
      },
      {
        title: 'Approve',
        url: '/dashboard/death-registration/approve',
        subject: 'Death Registration Approve',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.APPROVE_DEATH_REGISTRATION]
        }
      }
    ],
    // Super Admin, Admin, and Operators can view death registration
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.MANAGE_DEATH_REGISTRATION,
        PERMS.VIEW_DEATH_REGISTRATION,
        PERMS.CREATE_DEATH_REGISTRATION,
        PERMS.EDIT_DEATH_REGISTRATION,
        PERMS.DELETE_DEATH_REGISTRATION,
        PERMS.ENDORSE_DEATH_REGISTRATION,
        PERMS.VERIFY_DEATH_REGISTRATION,
        PERMS.APPROVE_DEATH_REGISTRATION
      ]
    }
  }
];
