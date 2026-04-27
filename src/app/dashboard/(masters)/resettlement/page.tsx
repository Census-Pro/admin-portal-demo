'use client';

import PageContainer from '@/components/layout/page-container';
import { ResettlementSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddResettlementButton } from './_components/add-resettlement-button';
import { ResettlementTable } from './_components/resettlement-table';
import { Suspense, useState } from 'react';

export default function ResettlementManagementPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <PageContainer
      pageTitle="Resettlement Management"
      pageDescription="Manage resettlement in the system."
      pageHeaderAction={
        <AddResettlementButton
          onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
        />
      }
    >
      <div className="space-y-4">
        <ResettlementSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={3} rowCount={10} />}
        >
          <ResettlementTable
            refreshTrigger={refreshTrigger}
            onDataChange={() => setRefreshTrigger((prev) => prev + 1)}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
