'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  getBirthApplicationsByStatus,
  getSubmittedBirthApplications,
  getEndorsedBirthApplications,
  getVerifiedBirthApplications,
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
    let isMounted = true;

    async function fetchData() {
      if (!isMounted) return;
      setIsLoading(true);
      setError(null);
      try {
        const statuses = Array.isArray(status) ? status : [status];
        const results = await Promise.all(
          statuses.map((s) => {
            if (s === 'SUBMITTED') return getSubmittedBirthApplications();
            if (s === 'ENDORSED') return getEndorsedBirthApplications();
            if (s === 'VERIFIED') return getVerifiedBirthApplications();
            return getBirthApplicationsByStatus(s);
          })
        );
        if (!isMounted || cancelled) return;

        const hasError = results.find((r) => !r.success);
        if (hasError) {
          setError('Failed to fetch applications');
          return;
        }

        const combined = results.flatMap((r) => r.data as unknown as TData[]);
        const total = results.reduce(
          (sum, r) => sum + (r.total_count ?? r.data.length),
          0
        );
        if (!isMounted || cancelled) return;
        setData(combined);
        setTotalItems(total);
      } catch (err) {
        if (!isMounted || cancelled) return;
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
      } finally {
        if (!isMounted || cancelled) return;
        setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
      isMounted = false;
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
