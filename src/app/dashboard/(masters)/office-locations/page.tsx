import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddOfficeLocationButton } from './_components/add-office-location-button';
import { OfficeLocationsSearchBar } from './_components/search-bar';
import { OfficeLocationsTable } from './_components/office-locations-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Office Location Management'
};

export default function OfficeLocationManagementPage() {
  return (
    <PageContainer
      pageTitle="Office Location Management"
      pageDescription="Manage office locations in the system."
      pageHeaderAction={<AddOfficeLocationButton />}
    >
      <div className="space-y-4">
        <OfficeLocationsSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={3} rowCount={10} />}
        >
          <OfficeLocationsTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
