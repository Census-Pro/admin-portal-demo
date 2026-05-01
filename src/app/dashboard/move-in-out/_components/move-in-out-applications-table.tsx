'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { Input } from '@/components/ui/input';
import { ColumnDef } from '@tanstack/react-table';
import {
  getSubmittedMoveInOutApplications,
  MoveInOutApplication
} from '@/actions/common/move-in-out-actions';

interface MoveInOutApplicationsTableProps {
  columns: ColumnDef<MoveInOutApplication, any>[];
  headerAction?: React.ReactNode;
}

export function MoveInOutApplicationsTable({
  columns,
  headerAction
}: MoveInOutApplicationsTableProps) {
  const [data, setData] = useState<MoveInOutApplication[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getSubmittedMoveInOutApplications();

        if (cancelled) return;

        if (!result.success) {
          setError(result.error ?? 'Failed to fetch applications');
          return;
        }

        setData(result.data);
        setTotalItems(result.total_count ?? result.data.length);
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by name, CID, or application number..."
          className="w-full md:max-w-sm"
        />
        {headerAction}
      </div>
      <DataTable columns={columns} data={data} totalItems={totalItems} />
    </div>
  );
}
