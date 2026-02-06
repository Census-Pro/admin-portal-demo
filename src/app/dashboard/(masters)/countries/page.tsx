import PageContainer from '@/components/layout/page-container';
import { AddCountryButton } from './_components/add-country-button';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import CountriesTable from './_components/countries-table';

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
