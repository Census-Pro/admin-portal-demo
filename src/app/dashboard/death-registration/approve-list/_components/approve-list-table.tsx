'use client';

import { useEffect, useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useQueryState, parseAsString } from 'nuqs';
import { getMyDeathTaskList } from '@/actions/common/death-registration-actions';
import { getDeathApproveListDoneIds } from '@/lib/cid-assessed-store';

interface ApproveListTableProps<TData> {
  columns: ColumnDef<TData, any>[];
}

export function ApproveListTable<TData extends Record<string, any>>({
  columns
}: ApproveListTableProps<TData>) {
  const [data, setData] = useState<TData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q] = useQueryState('q', parseAsString.withDefault(''));

  useEffect(() => {
    let cancelled = false;
    let isMounted = true;

    async function fetchData() {
      if (!isMounted) return;
      setIsLoading(true);
      setError(null);
      try {
        const result = await getMyDeathTaskList();
        if (!isMounted || cancelled) return;
        if (!result.success) {
          setError('Failed to fetch applications');
          return;
        }
        if (!isMounted || cancelled) return;
        const doneIds = getDeathApproveListDoneIds();
        setData(
          (result.data as unknown as TData[]).filter(
            (r: any) => !doneIds.has(r.id)
          )
        );
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
  }, []);

  const filtered = useMemo(() => {
    if (!q) return data;
    const lower = q.toLowerCase();
    return data.filter((row) => {
      const fullName =
        `${row.first_name ?? ''} ${row.middle_name ?? ''} ${row.last_name ?? ''}`.toLowerCase();
      const cid = (row.deceased_cid ?? '').toLowerCase();
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
