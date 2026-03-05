import PageContainer from '@/components/layout/page-container';
import { DzongkhagsSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddDzongkhagButton } from './_components/add-dzongkhag-button';
import { DzongkhagsTable } from './_components/dzongkhags-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Dzongkhag Management'
};

export default function DzongkhagManagementPage() {
  return (
    <PageContainer
      pageTitle="Dzongkhag Management"
      pageDescription="Manage dzongkhags in the system."
      pageHeaderAction={<AddDzongkhagButton />}
    >
      <div className="space-y-4">
        <DzongkhagsSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <DzongkhagsTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
