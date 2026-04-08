'use client';

import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';
import { useEffect, useState, useTransition, useCallback } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { getOperators } from '@/actions/common/operator-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useSessionExpired } from '@/hooks/use-session-expired';

interface Operator {
  id: string;
  cidNo: string;
  createdAt?: string;
  updatedAt?: string;
}

interface OperatorsTableProps {
  initialData?: Operator[];
  initialTotalItems?: number;
  refreshTrigger?: number;
  onDataChange?: () => void;
}

export function OperatorsTable({
  initialData = [],
  initialTotalItems = 0,
  refreshTrigger = 0,
  onDataChange
}: OperatorsTableProps) {
  const [isLoading, startTransition] = useTransition();
  const [data, setData] = useState<Operator[]>(initialData);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [error, setError] = useState<string | null>(null);
  const { checkSessionExpired, SessionExpiredDialog } = useSessionExpired();

  const [searchParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
      q: parseAsString.withDefault('')
    },
    {
      shallow: false,
      history: 'push'
    }
  );

  const fetchData = useCallback(async () => {
    startTransition(async () => {
      try {
        const result = await getOperators({
          page: searchParams.page,
          limit: searchParams.limit,
          search: searchParams.q
        });

        if (result.success) {
          setData(result.data || []);
          setTotalItems(result.totalItems || 0);
          setError(null);
        } else {
          // Check if session expired - if so, show dialog instead of error in table
          if (result.error && checkSessionExpired(result.error)) {
            return; // Dialog will handle the UI
          }

          setError(result.error || 'Failed to fetch operators');
          setData([]);
          setTotalItems(0);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        setData([]);
        setTotalItems(0);
      }
    });
  }, [
    searchParams.page,
    searchParams.limit,
    searchParams.q,
    checkSessionExpired
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  if (error) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (isLoading && data.length === 0) {
    return <DataTableSkeleton columnCount={3} rowCount={10} />;
  }

  return (
    <>
      <DataTable
        columns={columns(onDataChange)}
        data={data}
        totalItems={totalItems}
      />
      <SessionExpiredDialog />
    </>
  );
}
