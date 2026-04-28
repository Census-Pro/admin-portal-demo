'use client';

import PageContainer from '@/components/layout/page-container';
import { CidCollectionPointsSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddCidCollectionPointButton } from './_components/add-cid-collection-point-button';
import { CidCollectionPointsTable } from './_components/cid-collection-points-table';
import { Suspense, useState } from 'react';

export default function CidCollectionPointsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <PageContainer
      pageTitle="CID Collection Points Management"
      pageDescription="Manage CID collection points in the system."
      pageHeaderAction={
        <AddCidCollectionPointButton
          onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
        />
      }
    >
      <div className="space-y-4">
        <CidCollectionPointsSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={3} rowCount={10} />}
        >
          <CidCollectionPointsTable
            refreshTrigger={refreshTrigger}
            onDataChange={() => setRefreshTrigger((prev) => prev + 1)}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
