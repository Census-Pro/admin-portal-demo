'use client';

import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';
import { useEffect, useState, useTransition, useCallback } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { createColumns } from './columns';
import { getCensusStatuses } from '@/actions/common/census-status-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

interface CensusStatus {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CensusStatusesTableProps {
  initialData?: CensusStatus[];
  initialTotalItems?: number;
}

export function CensusStatusesTable({
  initialData = [],
  initialTotalItems = 0
}: CensusStatusesTableProps) {
  const [isLoading, startTransition] = useTransition();
  const [data, setData] = useState<CensusStatus[]>(initialData);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [error, setError] = useState<string | null>(null);

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
        const result = await getCensusStatuses({
          page: searchParams.page,
          limit: searchParams.limit,
          search: searchParams.q
        });

        if (result.censusStatuses) {
          setData(result.censusStatuses);
          setTotalItems(
            result.totalCensusStatuses || result.censusStatuses.length
          );
          setError(null);
        } else {
          setError('Failed to fetch census statuses');
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

  const handleUpdate = useCallback((updatedItem: CensusStatus) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, []);

  const handleDelete = useCallback((deletedId: string) => {
    setData((prevData) => prevData.filter((item) => item.id !== deletedId));
    setTotalItems((prev) => Math.max(0, prev - 1));
  }, []);

  const handleCreate = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for census status created events
  useEffect(() => {
    const handleCensusStatusCreated = () => {
      fetchData();
    };

    window.addEventListener('census-status-created', handleCensusStatusCreated);
    return () =>
      window.removeEventListener(
        'census-status-created',
        handleCensusStatusCreated
      );
  }, [fetchData]);

  const columns = createColumns({
    onUpdate: handleUpdate,
    onDelete: handleDelete,
    onCreate: handleCreate
  });

  if (error) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (isLoading && data.length === 0) {
    return <DataTableSkeleton columnCount={2} rowCount={10} />;
  }

  return <DataTable columns={columns} data={data} totalItems={totalItems} />;
}
