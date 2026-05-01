'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import { getHohApproveList } from '@/actions/common/hoh-change-actions';
import { Input } from '@/components/ui/input';
import {
  getHohChangeApprovedIds,
  markHohChangeApproved
} from '@/lib/cid-assessed-store';

interface HohChangeTableProps<TData> {
  columns: ColumnDef<TData, any>[];
}

export function HohChangeApproveTable<TData extends Record<string, any>>({
  columns
}: HohChangeTableProps<TData>) {
  const [data, setData] = useState<TData[]>([]);
  const [assigningIds, setAssigningIds] = useState<Set<string>>(new Set());
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
        const result = await getHohApproveList();
        if (cancelled) return;
        if (!result.success) {
          setError('Failed to fetch applications for approval');
          return;
        }
        const approvedIds = getHohChangeApprovedIds();
        setData(
          (result.data as unknown as TData[]).filter(
            (row: any) => !approvedIds.has(row.id)
          )
        );
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

  const handleAssign = useCallback((id: string) => {
    markHohChangeApproved(id);
    setData((prev) => prev.filter((r: any) => r.id !== id));
    setAssigningIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleAssignStart = useCallback((id: string) => {
    setAssigningIds((prev) => new Set(Array.from(prev).concat(id)));
  }, []);

  const handleAssignError = useCallback((id: string) => {
    setAssigningIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
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
        Loading HOH change applications for approval...
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
        meta={{
          onAssign: handleAssign,
          onAssignStart: handleAssignStart,
          onAssignError: handleAssignError,
          assigningIds
        }}
      />
    </div>
  );
}
