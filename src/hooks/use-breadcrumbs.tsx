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
  '/dashboard/payment-service-types': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Masters', link: '#' },
    { title: 'Payment Service Types', link: '/dashboard/payment-service-types' }
  ],
  '/dashboard/fine-types': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Masters', link: '#' },
    { title: 'Fine Types', link: '/dashboard/fine-types' }
  ],
  '/dashboard/dzongkhag': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Masters', link: '#' },
    { title: 'Dzongkhags', link: '/dashboard/dzongkhag' }
  ],
  '/dashboard/user': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Users', link: '/dashboard/user' }
  ],
  '/dashboard/birth-registration': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Birth Registration', link: '/dashboard/birth-registration' }
  ],
  '/dashboard/birth-registration/verify': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Birth Registration', link: '/dashboard/birth-registration' },
    { title: 'Verify', link: '/dashboard/birth-registration/verify' }
  ],
  '/dashboard/birth-registration/endorse': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Birth Registration', link: '/dashboard/birth-registration' },
    { title: 'Endorse', link: '/dashboard/birth-registration/endorse' }
  ],
  '/dashboard/death-registration/verify': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Death Registration', link: '/dashboard/death-registration' },
    { title: 'Verify', link: '/dashboard/death-registration/verify' }
  ],
  '/dashboard/death-registration/endorse': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Death Registration', link: '/dashboard/death-registration' },
    { title: 'Endorse', link: '/dashboard/death-registration/endorse' }
  ],
  '/dashboard/cid-issuance/fresh/assessment': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'CID Issuance', link: '/dashboard/cid-issuance' },
    { title: 'Fresh', link: '/dashboard/cid-issuance/fresh' },
    { title: 'Assessment', link: '/dashboard/cid-issuance/fresh/assessment' }
  ],
  '/dashboard/cid-issuance/fresh/payment': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'CID Issuance', link: '/dashboard/cid-issuance' },
    { title: 'Fresh', link: '/dashboard/cid-issuance/fresh' },
    { title: 'Payment', link: '/dashboard/cid-issuance/fresh/payment' }
  ],
  '/dashboard/cid-issuance/fresh/approval': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'CID Issuance', link: '/dashboard/cid-issuance' },
    { title: 'Fresh', link: '/dashboard/cid-issuance/fresh' },
    { title: 'Approval', link: '/dashboard/cid-issuance/fresh/approval' }
  ],
  '/dashboard/cid-issuance/renewal/assessment': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'CID Issuance', link: '/dashboard/cid-issuance' },
    { title: 'Renewal', link: '/dashboard/cid-issuance/renewal' },
    { title: 'Assessment', link: '/dashboard/cid-issuance/renewal/assessment' }
  ],
  '/dashboard/cid-issuance/renewal/payment': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'CID Issuance', link: '/dashboard/cid-issuance' },
    { title: 'Renewal', link: '/dashboard/cid-issuance/renewal' },
    { title: 'Payment', link: '/dashboard/cid-issuance/renewal/payment' }
  ],
  '/dashboard/cid-issuance/renewal/approval': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'CID Issuance', link: '/dashboard/cid-issuance' },
    { title: 'Renewal', link: '/dashboard/cid-issuance/renewal' },
    { title: 'Approval', link: '/dashboard/cid-issuance/renewal/approval' }
  ],
  '/dashboard/cid-issuance/replacement/assessment': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'CID Issuance', link: '/dashboard/cid-issuance' },
    { title: 'Replacement', link: '/dashboard/cid-issuance/replacement' },
    {
      title: 'Assessment',
      link: '/dashboard/cid-issuance/replacement/assessment'
    }
  ],
  '/dashboard/cid-issuance/replacement/payment': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'CID Issuance', link: '/dashboard/cid-issuance' },
    { title: 'Replacement', link: '/dashboard/cid-issuance/replacement' },
    { title: 'Payment', link: '/dashboard/cid-issuance/replacement/payment' }
  ],
  '/dashboard/cid-issuance/replacement/approval': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'CID Issuance', link: '/dashboard/cid-issuance' },
    { title: 'Replacement', link: '/dashboard/cid-issuance/replacement' },
    { title: 'Approval', link: '/dashboard/cid-issuance/replacement/approval' }
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

    // Handle dynamic routes with UUIDs or slugs
    if (
      pathname.startsWith('/dashboard/user/') &&
      pathname.split('/').length === 4
    ) {
      const segments = pathname.split('/');
      const userIdentifier = segments[3];

      // Check if it's a UUID or a slug
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          userIdentifier
        );

      if (isUuid) {
        return [
          { title: 'Dashboard', link: '/dashboard' },
          { title: 'Users', link: '/dashboard/user' },
          { title: 'User Details', link: pathname }
        ];
      } else {
        // Handle slug-based URLs (cleaner)
        return [
          { title: 'Dashboard', link: '/dashboard' },
          { title: 'Users', link: '/dashboard/user' },
          {
            title: userIdentifier
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            link: pathname
          }
        ];
      }
    }

    // Handle birth registration verify routes with UUIDs
    if (
      pathname.startsWith('/dashboard/birth-registration/verify/') &&
      pathname.split('/').length === 5
    ) {
      return [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Birth Registration', link: '/dashboard/birth-registration' },
        { title: 'Verify Details', link: pathname }
      ];
    }

    // Handle birth registration endorse routes with UUIDs
    if (
      pathname.startsWith('/dashboard/birth-registration/endorse/') &&
      pathname.split('/').length === 5
    ) {
      return [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Birth Registration', link: '/dashboard/birth-registration' },
        { title: 'Endorse Details', link: pathname }
      ];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;

      // Check if segment looks like an application number (e.g., HOH-2026-000001, REL-2026-000001)
      const isApplicationNumber = /^[A-Z]+-\d{4}-\d+$/i.test(segment);

      // Check if segment looks like a UUID and format it nicely
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          segment
        );

      if (isUuid || isApplicationNumber) {
        // For UUID/Application Number segments, try to determine context from previous segment
        const previousSegment = segments[index - 1];
        let contextTitle = 'Details';

        if (previousSegment === 'user') contextTitle = 'User Details';
        else if (previousSegment === 'employee')
          contextTitle = 'Employee Details';
        else if (previousSegment === 'product')
          contextTitle = 'Product Details';
        else if (previousSegment === 'hoh-change') contextTitle = 'Details';
        else if (previousSegment === 'nationality-certificate')
          contextTitle = 'Details';
        else if (previousSegment === 'relation-certificate')
          contextTitle = 'Details';

        return {
          title: contextTitle,
          link: path
        };
      }

      return {
        title:
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
