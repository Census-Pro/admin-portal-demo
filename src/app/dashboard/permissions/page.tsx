'use client';

import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddPermissionButton } from './_components/add-permission-button';
import { PermissionsTable } from './_components/permissions-table';
import { PermissionsSearchBar } from './_components/search-bar';
import { Suspense, useState } from 'react';

export default function PermissionManagementPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <PageContainer
      pageTitle="Permission Management"
      pageDescription="Manage system permissions and access controls."
      pageHeaderAction={<AddPermissionButton onSuccess={handleRefresh} />}
    >
      <div className="space-y-4">
        <PermissionsSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <PermissionsTable refreshTrigger={refreshTrigger} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
