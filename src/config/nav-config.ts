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
    superAdminOnly: true, // Only super admins can see the Dashboard
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
        title: 'Chiwogs',
        url: '/dashboard/chiwogs',
        shortcut: ['c', 'w'],
        subject: 'Chiwogs',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_CHIWOGS]
        }
      },
      {
        title: 'Villages',
        url: '/dashboard/villages',
        shortcut: ['v', 'l'],
        subject: 'Villages',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_VILLAGES]
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
      },
      {
        title: 'HOH Change Reason',
        url: '/dashboard/hoh-change-reason',
        shortcut: ['h', 'r'],
        subject: 'HOH Change Reason',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_HOH_CHANGE_REASON]
        }
      }
    ]
    // Parent access is automatic - shows if user has access to ANY child item
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
    ]
    // Parent access is automatic - shows if user has access to ANY child item
  },
  {
    title: 'Birth Registration',
    url: '#',
    icon: 'baby',
    isActive: false,
    items: [
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
        title: 'Endorse List',
        url: '/dashboard/birth-registration/endorsed-list',
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
        title: 'Verify List',
        url: '/dashboard/birth-registration/verify-list',
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
      },
      {
        title: 'Approve List',
        url: '/dashboard/birth-registration/approve-list',
        subject: 'Birth Registration Approve',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_BIRTH_REGISTRATION_APPROVE,
            PERMS.MANAGE_BIRTH_REGISTRATION
          ]
        }
      }
    ]
    // Parent access is automatic - shows if user has access to ANY workflow permission
  },
  {
    title: 'Death Registration',
    url: '#',
    icon: 'grave',
    isActive: false,
    items: [
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
        title: 'Endorse List',
        url: '/dashboard/death-registration/endorse-list',
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
        title: 'Verify List',
        url: '/dashboard/death-registration/verify-list',
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
      },
      {
        title: 'Approve List',
        url: '/dashboard/death-registration/approve-list',
        subject: 'Death Registration Approve',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_DEATH_REGISTRATION_APPROVE,
            PERMS.MANAGE_DEATH_REGISTRATION
          ]
        }
      }
    ]
    // Parent access is automatic - shows if user has access to ANY workflow permission
  },
  {
    title: 'HOH Change',
    url: '/dashboard/hoh-change',
    icon: 'userPen',
    isActive: false,
    items: [],
    subject: 'HOH Change',
    access: {
      permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_HOH_CHANGE]
    }
  },
  {
    title: 'Content',
    url: '/dashboard/content',
    icon: 'page',
    isActive: false,
    subject: 'Content',
    items: [
      {
        title: 'Public Notices',
        url: '/dashboard/content/announcements',
        shortcut: ['a', 'n'],
        subject: 'Publication',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_ANNOUNCEMENTS]
        }
      },
      {
        title: 'Content Pages',
        url: '/dashboard/content/pages',
        shortcut: ['c', 'o'],
        subject: 'CMS Assets',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_CONTENT]
        }
      },
      {
        title: 'Navigation',
        url: '/dashboard/content/navigation',
        shortcut: ['n', 'v'],
        subject: 'CMS Assets',
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
        title: 'Office Contacts',
        url: '/dashboard/content/office-contacts',
        shortcut: ['o', 'c'],
        subject: 'Office Contacts',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_CONTENT]
        }
      },
      {
        title: 'FAQ',
        url: '/dashboard/content/faq',
        shortcut: ['f', 'q'],
        subject: 'FAQ',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_CONTENT]
        }
      }
    ]
    // Parent access is automatic - shows if user has access to ANY child item
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
    ]
    // Parent access is automatic - shows if user has access to ANY workflow permission
  }
];
