'use client';

import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';
import {
  useEffect,
  useState,
  useTransition,
  useMemo,
  useCallback
} from 'react';
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
  const [isMounted, setIsMounted] = useState(false);

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
        const result = await getUsers(
          searchParams.page,
          searchParams.limit,
          searchParams.q
        );

        if (result.success) {
          const users = result.data || [];

          setData(users);
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
  }, [searchParams.page, searchParams.limit, searchParams.q]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchData();
    }
  }, [isMounted, fetchData]);

  // Listen for user creation events
  const handleUserCreated = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    window.addEventListener('userCreated', handleUserCreated);

    return () => {
      window.removeEventListener('userCreated', handleUserCreated);
    };
  }, [handleUserCreated]);

  // Listen for user deletion events
  const handleUserDeleted = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    window.addEventListener('userDeleted', handleUserDeleted);

    return () => {
      window.removeEventListener('userDeleted', handleUserDeleted);
    };
  }, [handleUserDeleted]);

  // Get columns with current user info
  const currentUserCidNo = session?.user?.cidNo;
  const columns = getColumns(currentUserCidNo);

  const sortedData = useMemo(() => {
    if (!isMounted || !session?.user?.cidNo) {
      return data;
    }

    const currentUserCidNo = session.user.cidNo;
    const currentUserIndex = data.findIndex(
      (user) => user.cidNo === currentUserCidNo
    );

    if (currentUserIndex > -1) {
      const newData = [...data];
      const [currentUser] = newData.splice(currentUserIndex, 1);
      newData.unshift(currentUser);
      return newData;
    }

    return data;
  }, [data, isMounted, session?.user?.cidNo]);

  return (
    <div>
      {error && (
        <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      )}
      {isLoading && data.length === 0 && !error && (
        <DataTableSkeleton columnCount={5} rowCount={10} />
      )}
      <div
        style={{
          display: error || (isLoading && data.length === 0) ? 'none' : 'block'
        }}
      >
        <DataTable
          columns={columns}
          data={sortedData}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
}
