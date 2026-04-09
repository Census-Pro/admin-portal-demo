import PageContainer from '@/components/layout/page-container';
import { MinorThromdesSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddMinorThromdeButton } from './_components/add-minor-thromde-button';
import { MinorThromdesListing } from './_components/minor-thromdes-listing';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Dashboard: Minor Thromdes Management'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function MinorThromdesManagementPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle="Minor Thromdes Management"
      pageDescription="Manage minor thromdes in the system."
      pageHeaderAction={<AddMinorThromdeButton />}
    >
      <div className="space-y-4">
        <MinorThromdesSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={3} rowCount={10} />}
        >
          <MinorThromdesListing />
        </Suspense>
      </div>
    </PageContainer>
  );
}
