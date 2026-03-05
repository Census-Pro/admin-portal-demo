import PageContainer from '@/components/layout/page-container';
import { GewogsSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddGewogButton } from './_components/add-gewog-button';
import { GewogsListing } from './_components/gewogs-listing';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Dashboard: Gewog Management'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function GewogManagementPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle="Gewog Management"
      pageDescription="Manage gewogs in the system."
      pageHeaderAction={<AddGewogButton />}
    >
      <div className="space-y-4">
        <GewogsSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <GewogsListing />
        </Suspense>
      </div>
    </PageContainer>
  );
}
