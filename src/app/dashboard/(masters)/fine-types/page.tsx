import PageContainer from '@/components/layout/page-container';
import { FineTypesSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddFineTypeButton } from './_components/add-fine-type-button';
import { FineTypesListing } from './_components/fine-types-listing';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Dashboard: Fine Types'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function FineTypesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle="Fine Types"
      pageDescription="Manage fine types and penalty amounts in the system."
      pageHeaderAction={<AddFineTypeButton />}
    >
      <div className="space-y-4">
        <FineTypesSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <FineTypesListing />
        </Suspense>
      </div>
    </PageContainer>
  );
}
