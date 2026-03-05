'use client';

import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';
import { useEffect, useState, useTransition, useCallback } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { createColumns } from './columns';
import { getRegularizationTypes } from '@/actions/common/regularization-type-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

interface RegularizationType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RegularizationTypesTableProps {
  initialData?: RegularizationType[];
  initialTotalItems?: number;
}

export function RegularizationTypesTable({
  initialData = [],
  initialTotalItems = 0
}: RegularizationTypesTableProps) {
  const [isLoading, startTransition] = useTransition();
  const [data, setData] = useState<RegularizationType[]>(initialData);
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
        const result = await getRegularizationTypes({
          page: searchParams.page,
          limit: searchParams.limit,
          search: searchParams.q
        });

        if (result.data) {
          setData(result.data);
          setTotalItems(result.totalItems || result.data.length);
          setError(null);
        } else {
          setError('Failed to fetch regularization types');
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
  }, [fetchData]);

  const handleUpdate = useCallback(
    (id: string, updatedItem: RegularizationType) => {
      setData((prevData) =>
        prevData.map((item) => (item.id === id ? updatedItem : item))
      );
    },
    []
  );

  const handleDelete = useCallback((id: string) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
    setTotalItems((prev) => prev - 1);
  }, []);

  const handleCreate = useCallback((newItem: RegularizationType) => {
    setData((prevData) => [newItem, ...prevData]);
    setTotalItems((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const handleRegularizationTypeCreated = (event: Event) => {
      const customEvent = event as CustomEvent<RegularizationType>;
      if (customEvent.detail) {
        handleCreate(customEvent.detail);
      }
    };

    window.addEventListener(
      'regularization-type-created',
      handleRegularizationTypeCreated
    );

    return () => {
      window.removeEventListener(
        'regularization-type-created',
        handleRegularizationTypeCreated
      );
    };
  }, [handleCreate]);

  const columns = createColumns(handleUpdate, handleDelete);

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
