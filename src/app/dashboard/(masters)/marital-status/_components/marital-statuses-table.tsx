'use client';

import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';
import { useEffect, useState, useTransition } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { getMaritalStatuses } from '@/actions/common/marital-status-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

interface MaritalStatus {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
        const result = await getMaritalStatuses({
          page: searchParams.page,
          limit: searchParams.limit
        });

        if (result.maritalStatuses) {
          setData(result.maritalStatuses);
          setTotalItems(
            result.totalMaritalStatuses || result.maritalStatuses.length
          );
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
    return <DataTableSkeleton columnCount={2} rowCount={10} />;
  }

  return <DataTable columns={columns} data={data} totalItems={totalItems} />;
}
