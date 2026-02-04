import PageContainer from '@/components/layout/page-container';
import { getGewogs } from '@/actions/common/gewog-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddGewogButton } from './_components/add-gewog-button';

export const metadata = {
  title: 'Dashboard: Gewog Management'
};

export default async function GewogManagementPage() {
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
          <GewogTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function GewogTable() {
  const result = await getGewogs();

  const gewogs = result.gewogs || [];
  const totalItems = result.totalGewogs || gewogs.length;

  return <DataTable columns={columns} data={gewogs} totalItems={totalItems} />;
}
