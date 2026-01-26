import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'User',
    url: '/dashboard/user',
    icon: 'teams',
    isActive: false,
    items: []
    // Access control example:
    // access: {
    //   permission: 'view:users'
    // }
  },
  {
    title: 'Roles & Permissions',
    url: '#',
    icon: 'shield',
    isActive: true,
    items: [
      {
        title: 'Roles',
        url: '/dashboard/master/roles',
        shortcut: ['r', 'o']
      },
      {
        title: 'Permissions',
        url: '/dashboard/master/permissions',
        shortcut: ['p', 'm']
      }
    ]
  },
  {
    title: 'Birth Registration',
    url: '/dashboard/birth-registration',
    icon: 'baby',
    isActive: false,
    items: []
    // Access control example:
    // access: {
    //   permission: 'view:birth-registration'
    // }
  },
  {
    title: 'CID Issuance',
    url: '/dashboard/cid-issuance',
    icon: 'idCard',
    isActive: false,
    items: [
      {
        title: 'New CID',
        url: '/dashboard/master/roles',
        shortcut: ['r', 'o']
      },
      {
        title: 'Replacement',
        url: '/dashboard/master/permissions',
        shortcut: ['p', 'm']
      },
      {
        title: 'Renewal',
        url: '/dashboard/master/permissions',
        shortcut: ['p', 'm']
      }
    ]
    // Access control example:
    // access: {
    //   permission: 'view:cid-issuance'
    // }
  },
  {
    title: 'Move In/Move Out',
    url: '/dashboard/move-in-out',
    icon: 'home',
    isActive: false,
    items: []
    // Access control example:
    // access: {
    //   permission: 'view:move-in-out'
    // }
  },
  {
    title: 'Relationships',
    url: '/dashboard/relationships',
    icon: 'family',
    isActive: false,
    items: []
    // Access control example:
    // access: {
    //   permission: 'view:relationships'
    // }
  },
  {
    title: 'Naturalization/Regularization',
    url: '/dashboard/naturalization',
    icon: 'certificate',
    isActive: false,
    items: []
    // Access control example:
    // access: {
    //   permission: 'view:naturalization'
    // }
  },
  {
    title: 'Death Registration',
    url: '/dashboard/death-registration',
    icon: 'grave',
    isActive: false,
    items: []
    // Access control example:
    // access: {
    //   permission: 'view:death-registration'
    // }
  }
];
