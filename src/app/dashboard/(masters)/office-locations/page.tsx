import PageContainer from '@/components/layout/page-container';
import { getOfficeLocations } from '@/actions/common/office-location-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddOfficeLocationButton } from './_components/add-office-location-button';
import { OfficeLocationsSearchBar } from './_components/search-bar';

export const metadata = {
  title: 'Dashboard: Office Location Management'
};

type SearchParams = Promise<{
  page?: string;
  limit?: string;
  q?: string;
}>;

export default async function OfficeLocationManagementPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;
  const q = searchParams.q || '';

  return (
    <PageContainer
      pageTitle="Office Location Management"
      pageDescription="Manage office locations in the system."
      pageHeaderAction={<AddOfficeLocationButton />}
    >
      <div className="space-y-4">
        <OfficeLocationsSearchBar />
        <Suspense
          key={`${page}-${limit}-${q}`}
          fallback={<DataTableSkeleton columnCount={3} rowCount={10} />}
        >
          <OfficeLocationsTable page={page} limit={limit} search={q} />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function OfficeLocationsTable({
  page,
  limit,
  search
}: {
  page: number;
  limit: number;
  search: string;
}) {
  const result = await getOfficeLocations(page, limit, search);

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const locations = result.data || [];

  return (
    <DataTable
      columns={columns}
      data={locations}
      totalItems={result.meta?.itemCount || locations.length}
    />
  );
}
