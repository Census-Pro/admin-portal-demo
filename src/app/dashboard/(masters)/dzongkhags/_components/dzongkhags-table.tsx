'use client';

import { useQueryStates, parseAsInteger } from 'nuqs';
import { useEffect, useState, useTransition, useCallback } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { createColumns } from './columns';
import { getDzongkhags } from '@/actions/common/dzongkhag-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

interface Dzongkhag {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DzongkhagsTableProps {
  initialData?: Dzongkhag[];
  initialTotalItems?: number;
}

export function DzongkhagsTable({
  initialData = [],
  initialTotalItems = 0
}: DzongkhagsTableProps) {
  const [isLoading, startTransition] = useTransition();
  const [data, setData] = useState<Dzongkhag[]>(initialData);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10)
    },
    {
      shallow: false,
      history: 'push'
    }
  );

  const fetchData = useCallback(async () => {
    startTransition(async () => {
      try {
        const result = await getDzongkhags({
          page: searchParams.page,
          limit: searchParams.limit
        });

        if (result.dzongkhags) {
          setData(result.dzongkhags);
          setTotalItems(result.totalDzongkhags || result.dzongkhags.length);
          setError(null);
        } else {
          setError('Failed to fetch dzongkhags');
          setData([]);
          setTotalItems(0);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        setData([]);
        setTotalItems(0);
      }
    });
  }, [searchParams.page, searchParams.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdate = useCallback((id: string, updatedItem: Dzongkhag) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === id ? updatedItem : item))
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
    setTotalItems((prev) => prev - 1);
  }, []);

  const handleCreate = useCallback((newItem: Dzongkhag) => {
    setData((prevData) => [newItem, ...prevData]);
    setTotalItems((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const handleDzongkhagCreated = (event: Event) => {
      const customEvent = event as CustomEvent<Dzongkhag>;
      if (customEvent.detail) {
        handleCreate(customEvent.detail);
      }
    };

    window.addEventListener('dzongkhag-created', handleDzongkhagCreated);

    return () => {
      window.removeEventListener('dzongkhag-created', handleDzongkhagCreated);
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
