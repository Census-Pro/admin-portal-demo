import PageContainer from '@/components/layout/page-container';
import { ChiwogsSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddChiwogButton } from './_components/add-chiwog-button';
import { ChiwogsListing } from './_components/chiwogs-listing';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Dashboard: Chiwog Management'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ChiwogManagementPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle="Chiwog Management"
      pageDescription="Manage chiwogs in the system."
      pageHeaderAction={<AddChiwogButton />}
    >
      <div className="space-y-4">
        <ChiwogsSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={3} rowCount={10} />}
        >
          <ChiwogsListing />
        </Suspense>
      </div>
    </PageContainer>
  );
}
