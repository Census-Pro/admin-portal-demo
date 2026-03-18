'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  getBirthApplicationsByStatus,
  BirthApplicationStatus
} from '@/actions/common/birth-registration-actions';

interface BirthApplicationsTableProps<TData> {
  status: BirthApplicationStatus;

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
        const result = await getBirthApplicationsByStatus(status);
        if (cancelled) return;
        if (result.success) {
          setData(result.data as TData[]);
          setTotalItems(result.total_count ?? result.data.length);
        } else {
          setError(result.error ?? 'Failed to fetch applications');
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
