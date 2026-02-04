import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { AddCountryButton } from './_components/add-country-button';
import { getCountries } from '@/actions/common/country-actions';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export const metadata = {
  title: 'Dashboard: Country Management'
};

export default async function CountryManagementPage() {
  return (
    <PageContainer
      pageTitle="Country Management"
      pageDescription="Manage countries in the system."
      pageHeaderAction={<AddCountryButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={3} rowCount={10} />}
        >
          <CountriesTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function CountriesTable() {
  const result = await getCountries();

  const data = result.success ? result.data : [];
  const totalItems = data.length;

  return <DataTable columns={columns} data={data} totalItems={totalItems} />;
}
