import PageContainer from '@/components/layout/page-container';
import { CidApplicationReasonsSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddCidApplicationReasonButton } from './_components/add-cid-application-reason-button';
import { CidApplicationReasonsListing } from './_components/cid-application-reasons-listing';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Dashboard: CID Application Reasons'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function CidApplicationReasonsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle="CID Application Reasons"
      pageDescription="Manage CID application reasons in the system."
      pageHeaderAction={<AddCidApplicationReasonButton />}
    >
      <div className="space-y-4">
        <CidApplicationReasonsSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <CidApplicationReasonsListing />
        </Suspense>
      </div>
    </PageContainer>
  );
}
