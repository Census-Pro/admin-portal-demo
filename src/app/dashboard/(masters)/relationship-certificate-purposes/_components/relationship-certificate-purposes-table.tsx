'use client';

import { useQueryStates, parseAsInteger } from 'nuqs';
import { useEffect, useState, useTransition, useCallback } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { createColumns } from './columns';
import { getRelationshipCertificatePurposes } from '@/actions/common/relationship-certificate-purpose-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

interface RelationshipCertificatePurpose {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RelationshipCertificatePurposesTableProps {
  initialData?: RelationshipCertificatePurpose[];
  initialTotalItems?: number;
}

export function RelationshipCertificatePurposesTable({
  initialData = [],
  initialTotalItems = 0
}: RelationshipCertificatePurposesTableProps) {
  const [isLoading, startTransition] = useTransition();
  const [data, setData] =
    useState<RelationshipCertificatePurpose[]>(initialData);
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
        const result = await getRelationshipCertificatePurposes({
          page: searchParams.page,
          limit: searchParams.limit
        });

        if (result.data) {
          setData(result.data);
          setTotalItems(result.totalItems || result.data.length);
          setError(null);
        } else {
          setError('Failed to fetch relationship certificate purposes');
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

  const handleUpdate = useCallback(
    (id: string, updatedItem: RelationshipCertificatePurpose) => {
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

  const handleCreate = useCallback(
    (newItem: RelationshipCertificatePurpose) => {
      setData((prevData) => [newItem, ...prevData]);
      setTotalItems((prev) => prev + 1);
    },
    []
  );

  useEffect(() => {
    const handleCertificatePurposeCreated = (event: Event) => {
      const customEvent = event as CustomEvent<RelationshipCertificatePurpose>;
      if (customEvent.detail) {
        handleCreate(customEvent.detail);
      }
    };

    window.addEventListener(
      'relationship-certificate-purpose-created',
      handleCertificatePurposeCreated
    );

    return () => {
      window.removeEventListener(
        'relationship-certificate-purpose-created',
        handleCertificatePurposeCreated
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
