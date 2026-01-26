'use client';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DEFAULT_DASHBOARD } from '@/config/dashboard-config';

export default function OverviewPage() {
  const dashboard = DEFAULT_DASHBOARD;

  return (
    <PageContainer
      pageTitle={dashboard.title}
      pageDescription={dashboard.description}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div
          className={cn('grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4')}
        >
          {dashboard.stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
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
          })}
        </div>

        <Card className="flex h-64 items-center justify-center border-dashed">
          <CardContent>
            <p className="text-muted-foreground text-center font-medium">
              Analytics & Power BI Widgets coming soon
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </PageContainer>
  );
}
