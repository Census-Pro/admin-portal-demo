import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddGewogButton } from './_components/add-gewog-button';
import { GewogsTable } from './_components/gewogs-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Gewog Management'
};

export default function GewogManagementPage() {
  return (
    <PageContainer
      pageTitle="Gewog Management"
      pageDescription="Manage gewogs in the system."
      pageHeaderAction={<AddGewogButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <GewogsTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
