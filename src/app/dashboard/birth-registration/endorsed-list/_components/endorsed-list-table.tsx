'use client';

import { useEffect, useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useQueryState, parseAsString } from 'nuqs';
import { getMyBirthTaskList } from '@/actions/common/birth-registration-actions';

interface EndorsedListTableProps<TData> {
  columns: ColumnDef<TData, any>[];
}

export function EndorsedListTable<TData extends Record<string, any>>({
  columns
}: EndorsedListTableProps<TData>) {
  const [data, setData] = useState<TData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q] = useQueryState('q', parseAsString.withDefault(''));

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getMyBirthTaskList();
        if (cancelled) return;
        if (!result.success) {
          setError(result.error ?? 'Failed to fetch applications');
          return;
        }
        setData(result.data as TData[]);
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
  }, []);

  const filtered = useMemo(() => {
    if (!q) return data;
    const lower = q.toLowerCase();
    return data.filter((row) => {
      const fullName =
        `${row.first_name ?? ''} ${row.middle_name ?? ''} ${row.last_name ?? ''}`.toLowerCase();
      const cid = (row.applicant_cid ?? '').toLowerCase();
      return fullName.includes(lower) || cid.includes(lower);
    });
  }, [data, q]);

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

  return (
    <DataTable columns={columns} data={filtered} totalItems={filtered.length} />
  );
}
