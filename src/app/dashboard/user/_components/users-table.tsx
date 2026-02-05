'use client';

import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';
import { useEffect, useState, useTransition } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { getColumns } from './columns';
import { getUsers } from '@/actions/common/user-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { User } from '@/types/user';
import { useSession } from 'next-auth/react';

interface UsersTableProps {
  initialData?: User[];
  initialTotalItems?: number;
}

export function UsersTable({
  initialData = [],
  initialTotalItems = 0
}: UsersTableProps) {
  const { data: session } = useSession();
  const [isLoading, startTransition] = useTransition();
  const [data, setData] = useState<User[]>(initialData);
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

  const fetchData = async () => {
    startTransition(async () => {
      try {
        const result = await getUsers(
          searchParams.page,
          searchParams.limit,
          searchParams.q
        );

        if (result.success) {
          setData(result.data || []);
          setTotalItems(result.count || 0);
          setError(null);
        } else {
          setError(result.error || 'Failed to fetch users');
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
  }, [searchParams.page, searchParams.limit, searchParams.q]);

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

  // Get columns with current user info
  const currentUserCidNo = session?.user?.cidNo;
  const columns = getColumns(currentUserCidNo);

  return <DataTable columns={columns} data={data} totalItems={totalItems} />;
}
