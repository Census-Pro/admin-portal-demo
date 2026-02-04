'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/employee': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employee', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Product', link: '/dashboard/product' }
  ],
  '/dashboard/roles': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Roles', link: '/dashboard/roles' }
  ],
  '/dashboard/permissions': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Permissions', link: '/dashboard/permissions' }
  ],
  '/dashboard/agencies': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Masters', link: '#' },
    { title: 'Agencies', link: '/dashboard/agencies' }
  ],
  '/dashboard/office-locations': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Masters', link: '#' },
    { title: 'Office Locations', link: '/dashboard/office-locations' }
  ],
  '/dashboard/relationship-types': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Masters', link: '#' },
    { title: 'Relationships', link: '/dashboard/relationship-types' }
  ],
  '/dashboard/dzongkhag': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Masters', link: '#' },
    { title: 'Dzongkhags', link: '/dashboard/dzongkhag' }
  ]
  // Add more custom mappings as needed
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
