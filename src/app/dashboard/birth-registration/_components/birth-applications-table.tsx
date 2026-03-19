'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  getBirthApplicationsByStatus,
  BirthApplicationStatus
} from '@/actions/common/birth-registration-actions';

interface BirthApplicationsTableProps<TData> {
  status: BirthApplicationStatus | BirthApplicationStatus[];

  columns: ColumnDef<TData, any>[];
}

export function BirthApplicationsTable<TData>({
  status,
  columns
}: BirthApplicationsTableProps<TData>) {
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
        const statuses = Array.isArray(status) ? status : [status];
        const results = await Promise.all(
          statuses.map((s) => getBirthApplicationsByStatus(s))
        );
        if (cancelled) return;

        const hasError = results.find((r) => !r.success);
        if (hasError) {
          setError(hasError.error ?? 'Failed to fetch applications');
          return;
        }

        const combined = results.flatMap((r) => r.data as TData[]);
        const total = results.reduce(
          (sum, r) => sum + (r.total_count ?? r.data.length),
          0
        );
        setData(combined);
        setTotalItems(total);
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
  }, [status]);

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
