import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddCityButton } from './_components/add-city-button';
import { CitiesTable } from './_components/cities-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: City Management'
};

export default function CityManagementPage() {
  return (
    <PageContainer
      pageTitle="City Management"
      pageDescription="Manage cities in the system."
      pageHeaderAction={<AddCityButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <CitiesTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
