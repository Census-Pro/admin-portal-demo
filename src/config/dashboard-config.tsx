import React from 'react';
import {
  Users,
  Shield,
  Lock,
  Activity,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';

export interface DashboardStat {
  label: string;
  value: string;
  icon?: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  description?: string;
  color?: string;
}

export interface DashboardConfig {
  title: string;
  description: string;
  stats: DashboardStat[];
}

export const ADMIN_DASHBOARD: DashboardConfig = {
  title: 'Welcome back 👋',
  description: "Here's an overview of your admin portal",
  stats: [
    {
      label: 'Total Users',
      value: '2,543',
      icon: Users,
      trend: '+12% from last month',
      trendUp: true,
      color: 'text-blue-600'
    },
    {
      label: 'Active Roles',
      value: '8',
      icon: Shield,
      trend: '2 pending approval',
      trendUp: false,
      color: 'text-emerald-600'
    },
    {
      label: 'Permissions',
      value: '24',
      icon: Lock,
      trend: 'All configured',
      trendUp: true,
      color: 'text-indigo-600'
    },
    {
      label: 'System Health',
      value: '99.9%',
      icon: Activity,
      trend: 'All services operational',
      trendUp: true,
      color: 'text-primary'
    }
  ]
};

export const SUPER_ADMIN_DASHBOARD: DashboardConfig = {
  title: 'Super Admin Dashboard',
  description: 'System administration and global overview',
  stats: [
    {
      label: 'Total System Users',
      value: '3,245',
      icon: Users,
      trend: '+18% from last month',
      trendUp: true,
      color: 'text-blue-600'
    },
    {
      label: 'Active Sessions',
      value: '145',
      icon: Activity,
      trend: '87% uptime',
      trendUp: true,
      color: 'text-green-600'
    },
    {
      label: 'System Health',
      value: '99.9%',
      icon: CheckCircle2,
      trend: 'All systems operational',
      trendUp: true,
      color: 'text-indigo-600'
    },
    {
      label: 'Alerts',
      value: '3',
      icon: AlertCircle,
      trend: 'Requires attention',
      trendUp: false,
      color: 'text-red-600'
    }
  ]
};

export const MANAGER_DASHBOARD: DashboardConfig = {
  title: 'Manager Dashboard',
  description: 'Team performance and workflow management',
  stats: [
    {
      label: 'Pending Approvals',
      value: '42',
      icon: Clock,
      trend: '-15% from yesterday',
      trendUp: true,
      color: 'text-orange-600'
    },
    {
      label: 'Completed Today',
      value: '28',
      icon: CheckCircle2,
      trend: '+10% improvement',
      trendUp: true,
      color: 'text-emerald-600'
    },
    {
      label: 'Active Tasks',
      value: '156',
      icon: FileText,
      trend: '12 due today',
      trendUp: false,
      color: 'text-blue-600'
    },
    {
      label: 'Team Efficiency',
      value: '94%',
      icon: Activity,
      trend: 'Above target',
      trendUp: true,
      color: 'text-primary'
    }
  ]
};

// Default export for easy access
export const DEFAULT_DASHBOARD = ADMIN_DASHBOARD;
