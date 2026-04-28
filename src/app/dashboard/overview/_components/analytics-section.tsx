'use client';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import type { ServiceStats } from '@/actions/dashboard/stats-actions';

interface AnalyticsSectionProps {
  services: ServiceStats[];
  totalPending: number;
}

const SERVICE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export function AnalyticsSection({
  services,
  totalPending
}: AnalyticsSectionProps) {
  const pieData = services
    .filter((s) => s.total > 0)
    .map((s, i) => ({
      name: s.shortName,
      value: s.total,
      color: SERVICE_COLORS[i % SERVICE_COLORS.length]
    }));

  const barData = services.map((s) => ({
    name: s.shortName,
    Pending: s.pending,
    Approved: s.approved,
    Rejected: s.rejected
  }));

  const totalApplications = services.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="text-primary h-4 w-4" />
        <h2 className="text-foreground text-sm font-semibold">
          System Overview
        </h2>
        <span className="text-muted-foreground text-xs">
          — Live snapshot across all services
        </span>
      </div>

      {/* Summary KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Card className="bg-primary/5 border-primary/20 col-span-2 sm:col-span-1">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Total Applications</p>
            <p className="mt-1 text-2xl font-bold">{totalApplications}</p>
          </CardContent>
        </Card>
        {services.map((s, i) => (
          <Link key={s.href} href={s.href}>
            <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <p className="text-muted-foreground truncate text-xs">
                  {s.shortName}
                </p>
                <p
                  className="mt-1 text-xl font-bold"
                  style={{ color: SERVICE_COLORS[i % SERVICE_COLORS.length] }}
                >
                  {s.total}
                </p>
                {s.pending > 0 && (
                  <p className="mt-0.5 text-xs font-medium text-amber-600">
                    {s.pending} pending
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Donut chart */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-medium">
              Application Distribution
            </CardTitle>
            <p className="text-muted-foreground text-xs">
              Total volume by service type
            </p>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="text-muted-foreground flex h-48 items-center justify-center text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value} applications`,
                      name
                    ]}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Grouped bar chart */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-medium">
              Status Breakdown by Service
            </CardTitle>
            <p className="text-muted-foreground text-xs">
              Pending · Approved · Rejected per service
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={barData}
                margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                barCategoryGap="30%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="Pending" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Approved" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Rejected" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pending actions table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium">
                Pending Actions Required
              </CardTitle>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Applications awaiting review or approval
              </p>
            </div>
            {totalPending > 0 ? (
              <Badge variant="destructive" className="shrink-0">
                {totalPending} needs attention
              </Badge>
            ) : (
              <Badge className="shrink-0 border-emerald-200 bg-emerald-100 text-emerald-700">
                All clear
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y">
            {services.map((service, i) => (
              <Link
                key={service.href}
                href={service.href}
                className="hover:bg-muted/50 group -mx-2 flex items-center justify-between rounded px-2 py-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor: SERVICE_COLORS[i % SERVICE_COLORS.length]
                    }}
                  />
                  <span className="text-sm font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground hidden w-20 text-right sm:block">
                    {service.total} total
                  </span>
                  <span className="text-muted-foreground hidden w-20 text-right text-emerald-600 sm:block">
                    {service.approved} approved
                  </span>
                  {service.pending > 0 ? (
                    <Badge
                      variant="outline"
                      className="w-24 justify-center border-amber-400 bg-amber-50 text-amber-700"
                    >
                      {service.pending} pending
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="w-24 justify-center border-emerald-400 bg-emerald-50 text-emerald-700"
                    >
                      Up to date
                    </Badge>
                  )}
                  <ArrowRight className="text-muted-foreground h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
