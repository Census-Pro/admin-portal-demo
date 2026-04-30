'use client';

import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';
import { useEffect, useState, useTransition, useCallback } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { getRelationships } from '@/actions/common/relationship-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

interface Relationship {
  id: string;
  name: string;
  isActive: boolean;
}

interface RelationshipsTableProps {
  initialData?: Relationship[];
  initialTotalItems?: number;
  refreshTrigger?: number;
  onDataChange?: () => void;
}

export function RelationshipsTable({
  initialData = [],
  initialTotalItems = 0,
  refreshTrigger = 0,
  onDataChange
}: RelationshipsTableProps) {
  const [isLoading, startTransition] = useTransition();
  const [data, setData] = useState<Relationship[]>(initialData);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [error, setError] = useState<string | null>(null);

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

  const fetchData = useCallback(async () => {
    startTransition(async () => {
      try {
        const result = await getRelationships({
          page: searchParams.page,
          limit: searchParams.limit,
          search: searchParams.q
        });

        if (result.success) {
          setData(result.data || []);
          setTotalItems(result.meta?.itemCount || 0);
          setError(null);
        } else {
          setError(result.error || 'Failed to fetch relationships');
          setData([]);
          setTotalItems(0);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        setData([]);
        setTotalItems(0);
      }
    });
  }, [searchParams.page, searchParams.limit, searchParams.q]);

  useEffect(() => {
    fetchData();
  }, [searchParams.page, searchParams.limit, searchParams.q, fetchData]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchData();
    }
  }, [refreshTrigger, fetchData]);

  if (error) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (isLoading && data.length === 0) {
    return <DataTableSkeleton columnCount={4} rowCount={10} />;
  }

  return (
    <DataTable
      columns={columns(onDataChange)}
      data={data}
      totalItems={totalItems}
    />
  );
}
