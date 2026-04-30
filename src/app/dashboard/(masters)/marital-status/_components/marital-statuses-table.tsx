'use client';

import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';
import { useEffect, useState, useTransition, useCallback } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { createColumns } from './columns';
import { getMaritalStatuses } from '@/actions/common/marital-status-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

interface MaritalStatus {
  id: string;
  name: string;
  isActive: boolean;
}

interface MaritalStatusesTableProps {
  initialData?: MaritalStatus[];
  initialTotalItems?: number;
}

export function MaritalStatusesTable({
  initialData = [],
  initialTotalItems = 0
}: MaritalStatusesTableProps) {
  const [isLoading, startTransition] = useTransition();
  const [data, setData] = useState<MaritalStatus[]>(initialData);
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
        const result = await getMaritalStatuses({
          page: searchParams.page,
          limit: searchParams.limit,
          search: searchParams.q
        });

        if (result.data) {
          setData(result.data);
          setTotalItems(result.meta?.itemCount || result.data.length);
          setError(null);
        } else {
          setError('Failed to fetch marital statuses');
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

  const handleUpdate = useCallback((updatedItem: MaritalStatus) => {
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

  // Listen for marital status created events
  useEffect(() => {
    const handleMaritalStatusCreated = () => {
      fetchData();
    };

    window.addEventListener(
      'marital-status-created',
      handleMaritalStatusCreated
    );
    return () =>
      window.removeEventListener(
        'marital-status-created',
        handleMaritalStatusCreated
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
