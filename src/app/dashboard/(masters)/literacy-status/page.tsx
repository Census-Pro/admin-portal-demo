import PageContainer from '@/components/layout/page-container';
import { LiteracyStatusSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddLiteracyStatusButton } from './_components/add-literacy-status-button';
import { LiteracyStatusesTable } from './_components/literacy-statuses-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Literacy Status Management'
};

export default function LiteracyStatusManagementPage() {
  return (
    <PageContainer
      pageTitle="Literacy Status Management"
      pageDescription="Manage literacy statuses in the system."
      pageHeaderAction={<AddLiteracyStatusButton />}
    >
      <div className="space-y-4">
        <LiteracyStatusSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <LiteracyStatusesTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
