'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  getDeathApplicationsByStatus,
  DeathApplicationStatus
} from '@/actions/common/death-registration-actions';

type FetchResult = {
  success: boolean;
  data: unknown[];
  total_count?: number;
  error?: string;
};

interface DeathApplicationsTableProps<TData> {
  status?: DeathApplicationStatus | DeathApplicationStatus[];
  columns: ColumnDef<TData, any>[];
  fetchFn?: () => Promise<FetchResult>;
}

export function DeathApplicationsTable<TData>({
  status,
  columns,
  fetchFn
}: DeathApplicationsTableProps<TData>) {
  const [data, setData] = useState<TData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        if (fetchFn) {
          const result = await fetchFn();
          if (cancelled) return;
          if (!result.success) {
            setError(result.error ?? 'Failed to fetch applications');
            return;
          }
          setData(result.data as TData[]);
          setTotalItems(result.total_count ?? result.data.length);
        } else if (status) {
          const statuses = Array.isArray(status) ? status : [status];
          const results = await Promise.all(
            statuses.map((s) => getDeathApplicationsByStatus(s))
          );
          if (cancelled) return;

          const hasError = results.find((r) => !r.success);
          if (hasError) {
            setError('Failed to fetch applications');
            return;
          }

          const combined = results.flatMap((r) => r.data as TData[]);
          const total = results.reduce(
            (sum, r) => sum + (r.total_count ?? r.data.length),
            0
          );
          setData(combined);
          setTotalItems(total);
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [status, fetchFn]);

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
        Loading applications…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  return <DataTable columns={columns} data={data} totalItems={totalItems} />;
}
