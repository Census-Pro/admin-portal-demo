'use client';

import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';
import { useEffect, useState, useTransition } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { getAgencies } from '@/actions/common/agency-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useSessionExpired } from '@/hooks/use-session-expired';

interface Agency {
  id: string;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AgenciesTableProps {
  initialData?: Agency[];
  initialTotalItems?: number;
  refreshTrigger?: number;
  onDataChange?: () => void;
}

export function AgenciesTable({
  initialData = [],
  initialTotalItems = 0,
  refreshTrigger = 0,
  onDataChange
}: AgenciesTableProps) {
  const [isLoading, startTransition] = useTransition();
  const [data, setData] = useState<Agency[]>(initialData);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [error, setError] = useState<string | null>(null);
  const { checkSessionExpired, SessionExpiredDialog } = useSessionExpired();

  const [searchParams, setSearchParams] = useQueryStates(
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

  const fetchData = async () => {
    startTransition(async () => {
      try {
        const result = await getAgencies({
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

          setError(result.error || 'Failed to fetch agencies');
          setData([]);
          setTotalItems(0);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        setData([]);
        setTotalItems(0);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [searchParams.page, searchParams.limit, searchParams.q, refreshTrigger]);

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
