'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  getVerifiedReceivingMoveInOutApplications,
  MoveInOutApplication
} from '@/actions/common/move-in-out-actions';

interface MoveInOutReceivingEndorseTableProps {
  columns: ColumnDef<MoveInOutApplication, any>[];
}

export function MoveInOutReceivingEndorseTable({
  columns
}: MoveInOutReceivingEndorseTableProps) {
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
        const result = await getVerifiedReceivingMoveInOutApplications();

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

  return <DataTable columns={columns} data={data} totalItems={totalItems} />;
}
