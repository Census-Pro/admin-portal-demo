import PageContainer from '@/components/layout/page-container';
import { MajorThromdesSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddMajorThromdeButton } from './_components/add-major-thromde-button';
import { MajorThromdesListing } from './_components/major-thromdes-listing';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Dashboard: Major Thromdes Management'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function MajorThromdesManagementPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle="Major Thromdes Management"
      pageDescription="Manage major thromdes in the system."
      pageHeaderAction={<AddMajorThromdeButton />}
    >
      <div className="space-y-4">
        <MajorThromdesSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <MajorThromdesListing />
        </Suspense>
      </div>
    </PageContainer>
  );
}
