import PageContainer from '@/components/layout/page-container';
import { getOfficeLocations } from '@/actions/common/office-location-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddOfficeLocationButton } from './_components/add-office-location-button';

export const metadata = {
  title: 'Dashboard: Office Location Management'
};

export default async function OfficeLocationManagementPage() {
  return (
    <PageContainer
      pageTitle="Office Location Management"
      pageDescription="Manage office locations in the system."
      pageHeaderAction={<AddOfficeLocationButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={3} rowCount={10} />}
        >
          <OfficeLocationsTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function OfficeLocationsTable() {
  const result = await getOfficeLocations(1, 100);

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const locations = result.data || [];

  return (
    <DataTable
      columns={columns}
      data={locations}
      totalItems={result.meta?.itemCount || locations.length}
    />
  );
}
