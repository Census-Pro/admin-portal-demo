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
        title: 'Major Thromdes',
        url: '/dashboard/major-thromdes',
        shortcut: ['m', 't'],
        subject: 'Major Thromdes',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_MAJOR_THROMDES]
        }
      },
      {
        title: 'Minor Thromdes',
        url: '/dashboard/minor-thromdes',
        shortcut: ['m', 'n'],
        subject: 'Minor Thromdes',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_MINOR_THROMDES]
        }
      },
      {
        title: 'CID Application Reasons',
        url: '/dashboard/cid-application-reasons',
        shortcut: ['c', 'r'],
        subject: 'CID Application Reasons',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_CID_APPLICATION_REASONS]
        }
      },
      {
        title: 'Payment Service Types',
        url: '/dashboard/payment-service-types',
        shortcut: ['p', 's'],
        subject: 'Payment Service Types',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_PAYMENT_SERVICE_TYPES]
        }
      },
      {
        title: 'Fine Types',
        url: '/dashboard/fine-types',
        shortcut: ['f', 't'],
        subject: 'Fine Types',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_FINE_TYPES]
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
      },
      {
        title: 'Operators',
        url: '/dashboard/operators',
        shortcut: ['o', 'p'],
        subject: 'Operators',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_OPERATORS]
        }
      },
      {
        title: 'Resettlement',
        url: '/dashboard/resettlement',
        shortcut: ['r', 's'],
        subject: 'Resettlement',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_RESETTLEMENT]
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
      // {
      //   title: 'Endorse List',
      //   url: '/dashboard/birth-registration/endorsed-list',
      //   subject: 'Birth Registration Endorse',
      //   access: {
      //     permissions: [
      //       PERMS.MANAGE_ALL,
      //       PERMS.MANAGE_BIRTH_REGISTRATION_ENDORSE,
      //       PERMS.MANAGE_BIRTH_REGISTRATION
      //     ]
      //   }
      // },
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
      // {
      //   title: 'Endorse List',
      //   url: '/dashboard/birth-registration/endorsed-list',
      //   subject: 'Birth Registration Endorse',
      //   access: {
      //     permissions: [
      //       PERMS.MANAGE_ALL,
      //       PERMS.MANAGE_BIRTH_REGISTRATION_ENDORSE,
      //       PERMS.MANAGE_BIRTH_REGISTRATION
      //     ]
      //   }
      // },
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
        title: 'My Approve List',
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
      // {
      //   title: 'Endorse List',
      //   url: '/dashboard/death-registration/endorse-list',
      //   subject: 'Death Registration Endorse',
      //   access: {
      //     permissions: [
      //       PERMS.MANAGE_ALL,
      //       PERMS.MANAGE_DEATH_REGISTRATION_ENDORSE,
      //       PERMS.MANAGE_DEATH_REGISTRATION
      //     ]
      //   }
      // },
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
      // {
      //   title: 'Endorse List',
      //   url: '/dashboard/death-registration/endorse-list',
      //   subject: 'Death Registration Endorse',
      //   access: {
      //     permissions: [
      //       PERMS.MANAGE_ALL,
      //       PERMS.MANAGE_DEATH_REGISTRATION_ENDORSE,
      //       PERMS.MANAGE_DEATH_REGISTRATION
      //     ]
      //   }
      // },
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
        title: 'My Approve List',
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
    url: '#',
    icon: 'userPen',
    isActive: false,
    items: [
      {
        title: 'Approve',
        url: '/dashboard/hoh-change/approve',
        subject: 'HOH Change Approve',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_HOH_CHANGE]
        }
      },
      {
        title: 'My Approve List',
        url: '/dashboard/hoh-change/approve-list',
        subject: 'HOH Change Approve',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_HOH_CHANGE]
        }
      }
    ]
    // Parent access is automatic - shows if user has access to ANY workflow permission
  },
  {
    title: 'Move In Move Out',
    url: '#',
    icon: 'arrowsRightLeft',
    isActive: false,
    items: [
      {
        title: 'Relieving',
        url: '/dashboard/move-in-out/relieving',
        subject: 'Move In Out Relieving',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_MOVE_IN_OUT]
        }
      },
      {
        title: 'Receiving',
        url: '#',
        subject: 'Move In Out Receiving',
        access: {
          permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_MOVE_IN_OUT]
        },
        items: [
          {
            title: 'Endorse',
            url: '/dashboard/move-in-out/receiving/endorse',
            subject: 'Move In Out Receiving Endorse',
            access: {
              permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_MOVE_IN_OUT]
            }
          },
          {
            title: 'Approve',
            url: '/dashboard/move-in-out/receiving/approve',
            subject: 'Move In Out Receiving Approve',
            access: {
              permissions: [PERMS.MANAGE_ALL, PERMS.MANAGE_MOVE_IN_OUT]
            }
          }
        ]
      }
    ]
    // Parent access is automatic - shows if user has access to ANY child item
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
    subject: 'CID Issuance',
    items: [
      {
        title: 'Fresh',
        url: '#',
        icon: 'add',
        isActive: true,
        subject: 'CID Issuance Fresh',
        items: [
          {
            title: 'Assessment',
            url: '/dashboard/cid-issuance/fresh/assessment',
            subject: 'CID Issuance Fresh Assessment',
            access: {
              permissions: [
                PERMS.MANAGE_ALL,
                PERMS.MANAGE_CID_ISSUANCE_FRESH_ASSESSMENT,
                PERMS.MANAGE_CID_ISSUANCE
              ]
            }
          },
          {
            title: 'Payment',
            url: '/dashboard/cid-issuance/fresh/payment',
            subject: 'CID Issuance Fresh Payment',
            access: {
              permissions: [
                PERMS.MANAGE_ALL,
                PERMS.MANAGE_CID_ISSUANCE_FRESH_PAYMENT,
                PERMS.MANAGE_CID_ISSUANCE
              ]
            }
          },
          {
            title: 'Approval',
            url: '/dashboard/cid-issuance/fresh/approval',
            subject: 'CID Issuance Fresh Approval',
            access: {
              permissions: [
                PERMS.MANAGE_ALL,
                PERMS.MANAGE_CID_ISSUANCE_FRESH_APPROVAL,
                PERMS.MANAGE_CID_ISSUANCE
              ]
            }
          }
        ]
      },
      {
        title: 'Renewal',
        url: '#',
        icon: 'edit',
        isActive: true,
        subject: 'CID Issuance Renewal',
        items: [
          {
            title: 'Assessment',
            url: '/dashboard/cid-issuance/renewal/assessment',
            subject: 'CID Issuance Renewal Assessment',
            access: {
              permissions: [
                PERMS.MANAGE_ALL,
                PERMS.MANAGE_CID_ISSUANCE_RENEWAL_ASSESSMENT,
                PERMS.MANAGE_CID_ISSUANCE
              ]
            }
          },
          {
            title: 'Payment',
            url: '/dashboard/cid-issuance/renewal/payment',
            subject: 'CID Issuance Renewal Payment',
            access: {
              permissions: [
                PERMS.MANAGE_ALL,
                PERMS.MANAGE_CID_ISSUANCE_RENEWAL_PAYMENT,
                PERMS.MANAGE_CID_ISSUANCE
              ]
            }
          },
          {
            title: 'Approval',
            url: '/dashboard/cid-issuance/renewal/approval',
            subject: 'CID Issuance Renewal Approval',
            access: {
              permissions: [
                PERMS.MANAGE_ALL,
                PERMS.MANAGE_CID_ISSUANCE_RENEWAL_APPROVAL,
                PERMS.MANAGE_CID_ISSUANCE
              ]
            }
          }
        ]
      },
      {
        title: 'Replacement',
        url: '#',
        icon: 'settings',
        isActive: true,
        subject: 'CID Issuance Replacement',
        items: [
          {
            title: 'Assessment',
            url: '/dashboard/cid-issuance/replacement/assessment',
            subject: 'CID Issuance Replacement Assessment',
            access: {
              permissions: [
                PERMS.MANAGE_ALL,
                PERMS.MANAGE_CID_ISSUANCE_REPLACEMENT_ASSESSMENT,
                PERMS.MANAGE_CID_ISSUANCE
              ]
            }
          },
          {
            title: 'Payment',
            url: '/dashboard/cid-issuance/replacement/payment',
            subject: 'CID Issuance Replacement Payment',
            access: {
              permissions: [
                PERMS.MANAGE_ALL,
                PERMS.MANAGE_CID_ISSUANCE_REPLACEMENT_PAYMENT,
                PERMS.MANAGE_CID_ISSUANCE
              ]
            }
          },
          {
            title: 'Approval',
            url: '/dashboard/cid-issuance/replacement/approval',
            subject: 'CID Issuance Replacement Approval',
            access: {
              permissions: [
                PERMS.MANAGE_ALL,
                PERMS.MANAGE_CID_ISSUANCE_REPLACEMENT_APPROVAL,
                PERMS.MANAGE_CID_ISSUANCE
              ]
            }
          }
        ]
      }
    ]
    // Parent access is automatic - shows if user has access to ANY workflow permission
  },
  {
    title: 'Nationality Certificate',
    url: '#',
    icon: 'certificate',
    isActive: false,
    subject: 'Nationality Certificate',
    items: [
      {
        title: 'Assessment',
        url: '/dashboard/nationality-certificate/assessment',
        subject: 'Nationality Certificate Assessment',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_NATIONALITY_CERTIFICATE_ASSESSMENT,
            PERMS.MANAGE_NATIONALITY_CERTIFICATE
          ]
        }
      },
      {
        title: 'Payment',
        url: '/dashboard/nationality-certificate/payment',
        subject: 'Nationality Certificate Payment',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_NATIONALITY_CERTIFICATE_PAYMENT,
            PERMS.MANAGE_NATIONALITY_CERTIFICATE
          ]
        }
      },
      {
        title: 'Approval',
        url: '/dashboard/nationality-certificate/approval',
        subject: 'Nationality Certificate Approval',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_NATIONALITY_CERTIFICATE_APPROVAL,
            PERMS.MANAGE_NATIONALITY_CERTIFICATE
          ]
        }
      }
    ]
    // Parent access is automatic - shows if user has access to ANY workflow permission
  },
  {
    title: 'Relation Certificate',
    url: '#',
    icon: 'teams',
    isActive: false,
    subject: 'Relation Certificate',
    items: [
      {
        title: 'Assessment',
        url: '/dashboard/relation-certificate/assessment',
        subject: 'Relation Certificate Assessment',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_RELATION_CERTIFICATE_ASSESSMENT,
            PERMS.MANAGE_RELATION_CERTIFICATE
          ]
        }
      },
      {
        title: 'Payment',
        url: '/dashboard/relation-certificate/payment',
        subject: 'Relation Certificate Payment',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_RELATION_CERTIFICATE_PAYMENT,
            PERMS.MANAGE_RELATION_CERTIFICATE
          ]
        }
      },
      {
        title: 'Approval',
        url: '/dashboard/relation-certificate/approval',
        subject: 'Relation Certificate Approval',
        access: {
          permissions: [
            PERMS.MANAGE_ALL,
            PERMS.MANAGE_RELATION_CERTIFICATE_APPROVAL,
            PERMS.MANAGE_RELATION_CERTIFICATE
          ]
        }
      }
    ]
    // Parent access is automatic - shows if user has access to ANY workflow permission
  }
];
