import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddCensusStatusButton } from './_components/add-census-status-button';
import { CensusStatusesTable } from './_components/census-statuses-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Census Status Management'
};

export default function CensusStatusManagementPage() {
  return (
    <PageContainer
      pageTitle="Census Status Management"
      pageDescription="Manage census statuses in the system."
      pageHeaderAction={<AddCensusStatusButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <CensusStatusesTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
