import { Icons } from '@/components/icons';

export interface PermissionCheck {
  // Single permission or array of permissions (OR logic - user needs ANY of these)
  permission?: string;
  permissions?: string[];
  // Single role or array of roles (OR logic - user needs ANY of these)
  role?: string;
  roles?: string[];
}

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  access?: PermissionCheck;
  subject?: string; // Backend ability subject for dynamic filtering
  superAdminOnly?: boolean; // Only visible to SUPER_ADMIN roleType
  isHeader?: boolean; // For grouping items in submenus
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
