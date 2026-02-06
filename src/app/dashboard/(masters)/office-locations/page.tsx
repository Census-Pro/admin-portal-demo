'use client';

import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddOfficeLocationButton } from './_components/add-office-location-button';
import { OfficeLocationsSearchBar } from './_components/search-bar';
import { OfficeLocationsTable } from './_components/office-locations-table';
import { Suspense, useState, useCallback } from 'react';

export default function OfficeLocationManagementPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataChange = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <PageContainer
      pageTitle="Office Location Management"
      pageDescription="Manage office locations in the system."
      pageHeaderAction={
        <AddOfficeLocationButton onSuccess={handleDataChange} />
      }
    >
      <div className="space-y-4">
        <OfficeLocationsSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={3} rowCount={10} />}
        >
          <OfficeLocationsTable
            refreshTrigger={refreshTrigger}
            onDataChange={handleDataChange}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
