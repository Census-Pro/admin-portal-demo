'use client';

import PageContainer from '@/components/layout/page-container';
import { AgenciesSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddAgencyButton } from './_components/add-agency-button';
import { AgenciesTable } from './_components/agencies-table';
import { Suspense, useState } from 'react';

export default function AgencyManagementPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <PageContainer
      pageTitle="Agency Management"
      pageDescription="Manage agencies in the system."
      pageHeaderAction={
        <AddAgencyButton
          onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
        />
      }
    >
      <div className="space-y-4">
        <AgenciesSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={3} rowCount={10} />}
        >
          <AgenciesTable
            refreshTrigger={refreshTrigger}
            onDataChange={() => setRefreshTrigger((prev) => prev + 1)}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
