'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { Input } from '@/components/ui/input';
import { ColumnDef } from '@tanstack/react-table';
import {
  getVerifiedReceivingMoveInOutApplications,
  MoveInOutApplication
} from '@/actions/common/move-in-out-actions';
import { getEndorsedReceivingIds } from '@/lib/cid-assessed-store';

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
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getVerifiedReceivingMoveInOutApplications();

        if (cancelled) return;

        if (!result.success) {
          setError('Failed to fetch applications');
          return;
        }

        const endorsedIds = getEndorsedReceivingIds();
        const filtered = result.data.filter((app) => !endorsedIds.has(app.id));
        setData(filtered);
        setTotalItems(filtered.length);
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

  const q = search.toLowerCase();
  const displayed = q
    ? data.filter(
        (app) =>
          app.name?.toLowerCase().includes(q) ||
          app.cid_no?.toLowerCase().includes(q) ||
          app.application_no?.toLowerCase().includes(q)
      )
    : data;

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name, CID, or application number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <DataTable
        columns={columns}
        data={displayed}
        totalItems={displayed.length}
      />
    </div>
  );
}
