'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertCircle, Users, Shield, Lock, Activity } from 'lucide-react';
import Link from 'next/link';
import { AnalyticsSection } from './analytics-section';
import type { ServiceStats } from '@/actions/dashboard/stats-actions';

interface DashboardStat {
  label: string;
  value: string;
  iconName?: 'users' | 'shield' | 'lock' | 'activity';
  trend?: string;
  trendUp?: boolean;
  color?: string;
  href?: string;
}

interface DashboardClientProps {
  stats: DashboardStat[];
  error?: string;
  analyticsServices?: ServiceStats[];
  analyticsTotalPending?: number;
}

// Map icon names to icon components
const iconMap = {
  users: Users,
  shield: Shield,
  lock: Lock,
  activity: Activity
};

export function DashboardClient({
  stats,
  error,
  analyticsServices,
  analyticsTotalPending
}: DashboardClientProps) {
  if (error) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <AlertCircle className="text-destructive mx-auto mb-2 h-6 w-6" />
        <p className="text-destructive">{error}</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Showing default statistics. Please check your connection to the auth
          service.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div
        className={cn('grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4')}
      >
        {stats.map((stat, index) => {
          const Icon = stat.iconName ? iconMap[stat.iconName] : null;
          const cardContent = (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  stat.href &&
                    'cursor-pointer transition-shadow hover:shadow-md'
                )}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  {Icon && <Icon className={cn('h-4 w-4', stat.color)} />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.trend && (
                    <p
                      className={cn(
                        'mt-1 text-xs font-medium',
                        stat.trendUp === true
                          ? 'text-emerald-600'
                          : stat.trendUp === false
                            ? 'text-orange-600'
                            : 'text-blue-600'
                      )}
                    >
                      {stat.trend}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );

          return stat.href ? (
            <Link key={index} href={stat.href}>
              {cardContent}
            </Link>
          ) : (
            cardContent
          );
        })}
      </div>

      {analyticsServices && analyticsServices.length > 0 ? (
        <AnalyticsSection
          services={analyticsServices}
          totalPending={analyticsTotalPending ?? 0}
        />
      ) : (
        <Card className="flex h-32 items-center justify-center border-dashed">
          <CardContent>
            <p className="text-muted-foreground text-center text-sm">
              Loading service analytics...
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
