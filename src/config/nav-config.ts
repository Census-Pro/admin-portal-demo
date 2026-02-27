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
    subject: 'Dashboard',
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
    subject: 'User',
    access: {
      permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_USERS]
    }
  },
  {
    title: 'Masters',
    url: '#',
    icon: 'billing',
    isActive: true,
    subject: 'Masters',
    items: [
      {
        title: 'Agencies',
        url: '/dashboard/agencies',
        shortcut: ['a', 'g'],
        subject: 'Agencies',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_AGENCIES]
        }
      },
      {
        title: 'Office Locations',
        url: '/dashboard/office-locations',
        shortcut: ['o', 'l'],
        subject: 'Office Locations',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_OFFICE_LOCATIONS]
        }
      },
      {
        title: 'Relationships',
        url: '/dashboard/relationship-types',
        shortcut: ['r', 'l'],
        subject: 'Relationship Types',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_RELATIONSHIP_TYPES]
        }
      },
      {
        title: 'Countries',
        url: '/dashboard/countries',
        shortcut: ['c', 'u'],
        subject: 'Countries',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_COUNTRIES]
        }
      },
      {
        title: 'Dzongkhags',
        url: '/dashboard/dzongkhags',
        shortcut: ['d', 'z'],
        subject: 'Dzongkhags',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_DZONGKHAGS]
        }
      },
      {
        title: 'Gewogs',
        url: '/dashboard/gewogs',
        shortcut: ['g', 'w'],
        subject: 'Gewogs',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_GEWOGS]
        }
      },
      {
        title: 'Cities',
        url: '/dashboard/cities',
        shortcut: ['c', 't'],
        subject: 'Cities',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_CITIES]
        }
      },
      {
        title: 'Genders',
        url: '/dashboard/genders',
        shortcut: ['g', 'n'],
        subject: 'Genders',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_GENDERS]
        }
      },
      {
        title: 'Marital Status',
        url: '/dashboard/marital-status',
        shortcut: ['m', 's'],
        subject: 'Marital Status',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_MARITAL_STATUS]
        }
      },
      {
        title: 'Literacy Status',
        url: '/dashboard/literacy-status',
        shortcut: ['l', 's'],
        subject: 'Literacy Status',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_LITERACY_STATUS]
        }
      },
      {
        title: 'Census Status',
        url: '/dashboard/census-status',
        shortcut: ['c', 's'],
        subject: 'Census Status',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_CENSUS_STATUS]
        }
      },
      {
        title: 'Naturalization Types',
        url: '/dashboard/naturalization-types',
        shortcut: ['n', 't'],
        subject: 'Naturalization Types',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_NATURALIZATION_TYPES]
        }
      },
      {
        title: 'Regularization Types',
        url: '/dashboard/regularization-types',
        shortcut: ['r', 't'],
        subject: 'Regularization Types',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_REGULARIZATION_TYPES]
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
            PERMS.MANAGE_RELATIONSHIP_CERTIFICATE_PURPOSES
          ]
        }
      }
    ],
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.MANAGE_AGENCIES,
        PERMS.MANAGE_OFFICE_LOCATIONS,
        PERMS.MANAGE_RELATIONSHIP_TYPES,
        PERMS.MANAGE_COUNTRIES,
        PERMS.MANAGE_DZONGKHAGS,
        PERMS.MANAGE_GEWOGS,
        PERMS.MANAGE_CITIES,
        PERMS.MANAGE_GENDERS,
        PERMS.MANAGE_MARITAL_STATUS,
        PERMS.MANAGE_LITERACY_STATUS,
        PERMS.MANAGE_CENSUS_STATUS,
        PERMS.MANAGE_NATURALIZATION_TYPES,
        PERMS.MANAGE_REGULARIZATION_TYPES,
        PERMS.MANAGE_RELATIONSHIP_CERTIFICATE_PURPOSES
      ]
    }
  },
  {
    title: 'Roles & Permission',
    url: '#',
    icon: 'shield',
    isActive: true,
    subject: 'Roles & Permissions',
    items: [
      {
        title: 'Roles',
        url: '/dashboard/roles',
        shortcut: ['r', 'o'],
        subject: 'Roles',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_ROLES]
        }
      },
      {
        title: 'Permissions',
        url: '/dashboard/permissions',
        shortcut: ['p', 'm'],
        subject: 'Permissions',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_PERMISSIONS]
        }
      }
    ],
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
    url: '#',
    icon: 'baby',
    isActive: false,
    items: [
      {
        title: 'Pending Applications',
        url: '/dashboard/birth-registration/pending',
        subject: 'Birth Registration Pending',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_BIRTH_REGISTRATION_PENDING,
            PERMS.MANAGE_BIRTH_REGISTRATION
          ]
        }
      },
      {
        title: 'Endorse',
        url: '/dashboard/birth-registration/endorse',
        subject: 'Birth Registration Endorse',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_BIRTH_REGISTRATION_ENDORSE,
            PERMS.MANAGE_BIRTH_REGISTRATION
          ]
        }
      },
      {
        title: 'Verify',
        url: '/dashboard/birth-registration/verify',
        subject: 'Birth Registration Verify',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_BIRTH_REGISTRATION_VERIFY,
            PERMS.MANAGE_BIRTH_REGISTRATION
          ]
        }
      },
      {
        title: 'Approve',
        url: '/dashboard/birth-registration/approve',
        subject: 'Birth Registration Approve',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_BIRTH_REGISTRATION_APPROVE,
            PERMS.MANAGE_BIRTH_REGISTRATION
          ]
        }
      }
    ],
    // Parent menu shows if user has ANY workflow permission
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.MANAGE_BIRTH_REGISTRATION,
        PERMS.MANAGE_BIRTH_REGISTRATION_PENDING,
        PERMS.MANAGE_BIRTH_REGISTRATION_ENDORSE,
        PERMS.MANAGE_BIRTH_REGISTRATION_VERIFY,
        PERMS.MANAGE_BIRTH_REGISTRATION_APPROVE
      ]
    }
  },
  {
    title: 'Death Registration',
    url: '#',
    icon: 'grave',
    isActive: false,
    items: [
      {
        title: 'Pending Applications',
        url: '/dashboard/death-registration/pending',
        subject: 'Death Registration Pending',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_DEATH_REGISTRATION_PENDING,
            PERMS.MANAGE_DEATH_REGISTRATION
          ]
        }
      },
      {
        title: 'Endorse',
        url: '/dashboard/death-registration/endorse',
        subject: 'Death Registration Endorse',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_DEATH_REGISTRATION_ENDORSE,
            PERMS.MANAGE_DEATH_REGISTRATION
          ]
        }
      },
      {
        title: 'Verify',
        url: '/dashboard/death-registration/verify',
        subject: 'Death Registration Verify',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_DEATH_REGISTRATION_VERIFY,
            PERMS.MANAGE_DEATH_REGISTRATION
          ]
        }
      },
      {
        title: 'Approve',
        url: '/dashboard/death-registration/approve',
        subject: 'Death Registration Approve',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_DEATH_REGISTRATION_APPROVE,
            PERMS.MANAGE_DEATH_REGISTRATION
          ]
        }
      }
    ],
    // Parent menu shows if user has ANY workflow permission
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.MANAGE_DEATH_REGISTRATION,
        PERMS.MANAGE_DEATH_REGISTRATION_PENDING,
        PERMS.MANAGE_DEATH_REGISTRATION_ENDORSE,
        PERMS.MANAGE_DEATH_REGISTRATION_VERIFY,
        PERMS.MANAGE_DEATH_REGISTRATION_APPROVE
      ]
    }
  },
  {
    title: 'Content',
    url: '#',
    icon: 'page',
    isActive: false,
    subject: 'Content',
    items: [
      {
        title: 'PUBLICATION',
        url: '#',
        isHeader: true,
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_ANNOUNCEMENTS]
        }
      },
      {
        title: 'Public Notices',
        url: '/dashboard/content/announcements',
        shortcut: ['a', 'n'],
        subject: 'Announcements',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_ANNOUNCEMENTS]
        }
      },
      {
        title: 'Notice Categories',
        url: '/dashboard/content/categories',
        shortcut: ['a', 'c'],
        subject: 'Announcement Categories',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_ANNOUNCEMENTS]
        }
      },
      {
        title: 'CMS ASSETS',
        url: '#',
        isHeader: true,
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_CMS]
        }
      },
      {
        title: 'Content Pages',
        url: '/dashboard/content/pages',
        shortcut: ['c', 'o'],
        subject: 'Content',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_CONTENT]
        }
      },
      {
        title: 'Media Library',
        url: '/dashboard/content/media',
        shortcut: ['m', 'l'],
        subject: 'Media Library',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_MEDIA_LIBRARY]
        }
      },
      {
        title: 'Navigation',
        url: '/dashboard/content/navigation',
        shortcut: ['n', 'v'],
        subject: 'Navigation',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_NAVIGATION]
        }
      },
      {
        title: 'Quick Links',
        url: '/dashboard/content/quick-links',
        shortcut: ['q', 'l'],
        subject: 'Quick Links',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_CONTENT]
        }
      },
      {
        title: 'Quick Link Categories',
        url: '/dashboard/content/quick-link-categories',
        shortcut: ['q', 'c'],
        subject: 'Quick Link Categories',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_CONTENT]
        }
      }
    ],
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.MANAGE_CMS,
        PERMS.MANAGE_ANNOUNCEMENTS,
        PERMS.MANAGE_CONTENT,
        PERMS.MANAGE_MEDIA_LIBRARY,
        PERMS.MANAGE_NAVIGATION
      ]
    }
  },
  {
    title: 'CID Issuance',
    url: '#',
    icon: 'idCard',
    isActive: false,
    items: [
      {
        title: 'Approve',
        url: '/dashboard/cid-issuance/approve',
        subject: 'CID Issuance Approve',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_CID_ISSUANCE_APPROVE,
            PERMS.MANAGE_CID_ISSUANCE
          ]
        }
      },
      {
        title: 'Print CID',
        url: '/dashboard/cid-issuance/print',
        subject: 'CID Issuance Print',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_CID_ISSUANCE_PRINT,
            PERMS.MANAGE_CID_ISSUANCE
          ]
        }
      }
    ],
    // Parent menu shows if user has ANY workflow permission
    access: {
      permissions: [
        PERMS.MANAGE_ALL,
        PERMS.MANAGE_CID_ISSUANCE,
        PERMS.MANAGE_CID_ISSUANCE_APPROVE,
        PERMS.MANAGE_CID_ISSUANCE_PRINT
      ]
    }
  }
];
