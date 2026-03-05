import PageContainer from '@/components/layout/page-container';
import { MaritalStatusSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddMaritalStatusButton } from './_components/add-marital-status-button';
import { MaritalStatusesTable } from './_components/marital-statuses-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Marital Status Management'
};

export default function MaritalStatusManagementPage() {
  return (
    <PageContainer
      pageTitle="Marital Status Management"
      pageDescription="Manage marital statuses in the system."
      pageHeaderAction={<AddMaritalStatusButton />}
    >
      <div className="space-y-4">
        <MaritalStatusSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <MaritalStatusesTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
