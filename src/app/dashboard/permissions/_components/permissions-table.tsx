'use client';

import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';
import { useEffect, useState, useTransition } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { getPermissions } from '@/actions/common/permission-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

interface Permission {
  id: string;
  name: string;
  description: string;
  actions: string[];
  subjects: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface PermissionsTableProps {
  initialData?: Permission[];
  initialTotalItems?: number;
}

export function PermissionsTable({
  initialData = [],
  initialTotalItems = 0
}: PermissionsTableProps) {
  const [isLoading, startTransition] = useTransition();
  const [data, setData] = useState<Permission[]>(initialData);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10)
    },
    {
      shallow: false,
      history: 'push'
    }
  );

  const fetchData = async () => {
    startTransition(async () => {
      try {
        const result = await getPermissions(
          searchParams.page,
          searchParams.limit
        );

        if (result.success) {
          setData(result.data || []);
          setTotalItems((result.data || []).length);
          setError(null);
        } else {
          setError(result.error || 'Failed to fetch permissions');
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
  }, [searchParams.page, searchParams.limit]);

  if (error) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (isLoading && data.length === 0) {
    return <DataTableSkeleton columnCount={5} rowCount={10} />;
  }

  return <DataTable columns={columns} data={data} totalItems={totalItems} />;
}
