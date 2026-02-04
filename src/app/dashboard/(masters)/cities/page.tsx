import PageContainer from '@/components/layout/page-container';
import { getCities } from '@/actions/common/city-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddCityButton } from './_components/add-city-button';

export const metadata = {
  title: 'Dashboard: City Management'
};

export default async function CityManagementPage() {
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
          <CityTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function CityTable() {
  const result = await getCities();

  const cities = result.cities || [];
  const totalItems = result.totalCities || cities.length;

  return <DataTable columns={columns} data={cities} totalItems={totalItems} />;
}
