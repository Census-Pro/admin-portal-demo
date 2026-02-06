import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddCityButton } from './_components/add-city-button';
import { CitiesListing } from './_components/cities-listing';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Dashboard: City Management'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function CityManagementPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

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
          <CitiesListing />
        </Suspense>
      </div>
    </PageContainer>
  );
}
