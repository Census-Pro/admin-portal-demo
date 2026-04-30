'use client';

import { useEffect, useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import { getSubmittedHohChanges } from '@/actions/common/hoh-change-actions';
import { Input } from '@/components/ui/input';

interface HohChangeTableProps<TData> {
  columns: ColumnDef<TData, any>[];
}

export function HohChangeTable<TData extends Record<string, any>>({
  columns
}: HohChangeTableProps<TData>) {
  const [data, setData] = useState<TData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useQueryState('q', parseAsString.withDefault(''));

  const [, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getSubmittedHohChanges();
        if (cancelled) return;
        if (!result.success) {
          setError('Failed to fetch applications');
          return;
        }
        setData(result.data as unknown as TData[]);
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
        `${row.firstName ?? ''} ${row.middleName ?? ''} ${row.lastName ?? ''}`.toLowerCase();
      const cid = (row.applicantCidNo ?? '').toLowerCase();
      const hohCid = (row.hohCidNo ?? '').toLowerCase();
      const newHohCid = (row.newHohCidNo ?? '').toLowerCase();
      const applicationNo = (row.applicationNo ?? '').toLowerCase();
      const householdNo = (row.householdNo ?? '').toLowerCase();
      return (
        fullName.includes(lower) ||
        cid.includes(lower) ||
        hohCid.includes(lower) ||
        newHohCid.includes(lower) ||
        applicationNo.includes(lower) ||
        householdNo.includes(lower)
      );
    });
  }, [data, q]);

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
        Loading HOH change applications…
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by application no, CID..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          className="w-full md:max-w-sm"
        />
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        totalItems={filtered.length}
      />
    </div>
  );
}
