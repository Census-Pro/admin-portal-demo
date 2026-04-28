import PageContainer from '@/components/layout/page-container';
import { getDashboardStats } from '@/actions/dashboard/stats-actions';
import type { ServiceStats } from '@/actions/dashboard/stats-actions';
import { DashboardClient } from './_components/dashboard-client';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { checkPermission } from '@/lib/permission-check';

const DUMMY_ANALYTICS_SERVICES: ServiceStats[] = [
  {
    name: 'CID Issuance',
    shortName: 'CID',
    total: 128,
    pending: 34,
    approved: 81,
    rejected: 13,
    href: '/dashboard/cid-issuance'
  },
  {
    name: 'Birth Registration',
    shortName: 'Birth',
    total: 74,
    pending: 18,
    approved: 52,
    rejected: 4,
    href: '/dashboard/birth-registration'
  },
  {
    name: 'HOH Change',
    shortName: 'HOH',
    total: 45,
    pending: 12,
    approved: 29,
    rejected: 4,
    href: '/dashboard/hoh-change'
  },
  {
    name: 'Nationality Certificate',
    shortName: 'Nationality',
    total: 31,
    pending: 9,
    approved: 20,
    rejected: 2,
    href: '/dashboard/nationality-certificate'
  },
  {
    name: 'Relation Certificate',
    shortName: 'Relation',
    total: 22,
    pending: 5,
    approved: 16,
    rejected: 1,
    href: '/dashboard/relation-certificate'
  }
];

const DUMMY_TOTAL_PENDING = DUMMY_ANALYTICS_SERVICES.reduce(
  (sum, s) => sum + s.pending,
  0
);

export default async function OverviewPage() {
  const session = await auth();

  // Dashboard is restricted to SUPER_ADMIN only
  if (session?.user?.roleType !== 'SUPER_ADMIN') {
    redirect('/dashboard/unauthorized');
  }

  // Fetch real data from auth_service
  const statsResult = await getDashboardStats();

  const statsData = statsResult.success ? statsResult.data : null;

  // Build dashboard config with real data (using icon names as strings)
  const dashboardStats = [
    {
      label: 'Total Users',
      value: statsData?.totalUsers.toString() || '0',
      iconName: 'users' as const,
      trend: 'Total registered users',
      trendUp: true,
      color: 'text-blue-600',
      href: '/dashboard/user'
    },
    {
      label: 'Roles',
      value: statsData?.totalRoles.toString() || '0',
      iconName: 'shield' as const,
      trend: 'Total available roles',
      trendUp: false,
      color: 'text-emerald-600',
      href: '/dashboard/roles'
    },
    {
      label: 'Permissions',
      value: statsData?.totalPermissions.toString() || '0',
      iconName: 'lock' as const,
      trend: 'Total available permissions',
      trendUp: true,
      color: 'text-indigo-600',
      href: '/dashboard/permissions'
    },
    {
      label: 'System Health',
      value: '99.9%',
      iconName: 'activity' as const,
      trend: 'All services operational',
      trendUp: true,
      color: 'text-primary'
    }
  ];

  return (
    <PageContainer
      pageTitle="Welcome back 👋"
      pageDescription="Here's an overview of your admin portal"
    >
      <DashboardClient
        stats={dashboardStats}
        error={statsResult.error}
        analyticsServices={DUMMY_ANALYTICS_SERVICES}
        analyticsTotalPending={DUMMY_TOTAL_PENDING}
      />
    </PageContainer>
  );
}
