import PageContainer from '@/components/layout/page-container';
import { getDashboardStats } from '@/actions/dashboard/stats-actions';
import { DashboardClient } from './_components/dashboard-client';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { checkPermission } from '@/lib/permission-check';

export default async function OverviewPage() {
  const session = await auth();

  // Check if user has permission to view dashboard
  const permissionCheck = checkPermission(session, [
    'read:dashboard',
    'manage:all'
  ]);

  // If user doesn't have permission, redirect to unauthorized page
  if (!permissionCheck.hasAccess) {
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
      trend: '+12% from last month',
      trendUp: true,
      color: 'text-blue-600',
      href: '/dashboard/user'
    },
    {
      label: 'Active Roles',
      value: statsData?.activeRoles.toString() || '0',
      iconName: 'shield' as const,
      trend:
        statsData?.pendingRoles && statsData.pendingRoles > 0
          ? `${statsData.pendingRoles} pending approval`
          : 'All active',
      trendUp: false,
      color: 'text-emerald-600',
      href: '/dashboard/roles'
    },
    {
      label: 'Permissions',
      value: statsData?.totalPermissions.toString() || '0',
      iconName: 'lock' as const,
      trend: 'All configured',
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
      <DashboardClient stats={dashboardStats} error={statsResult.error} />
    </PageContainer>
  );
}
