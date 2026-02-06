'use client';

import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddRelationshipButton } from './_components/add-relationship-button';
import { RelationshipsTable } from './_components/relationships-table';
import { Suspense, useState, useCallback } from 'react';

export default function RelationshipManagementPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataChange = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <PageContainer
      pageTitle="Relationship Management"
      pageDescription="Manage relationship types in the system."
      pageHeaderAction={<AddRelationshipButton onSuccess={handleDataChange} />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
        >
          <RelationshipsTable
            refreshTrigger={refreshTrigger}
            onDataChange={handleDataChange}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
