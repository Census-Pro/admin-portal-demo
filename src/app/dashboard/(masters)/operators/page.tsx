'use client';

import PageContainer from '@/components/layout/page-container';
import { OperatorsSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddOperatorButton } from './_components/add-operator-button';
import { OperatorsTable } from './_components/operators-table';
import { Suspense, useState } from 'react';

export default function OperatorManagementPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <PageContainer
      pageTitle="Operator Management"
      pageDescription="Manage operators in the system."
      pageHeaderAction={
        <AddOperatorButton
          onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
        />
      }
    >
      <div className="space-y-4">
        <OperatorsSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={3} rowCount={10} />}
        >
          <OperatorsTable
            refreshTrigger={refreshTrigger}
            onDataChange={() => setRefreshTrigger((prev) => prev + 1)}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
