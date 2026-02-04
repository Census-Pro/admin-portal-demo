import PageContainer from '@/components/layout/page-container';
import { getDzongkhags } from '@/actions/common/dzongkhag-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddDzongkhagButton } from './_components/add-dzongkhag-button';

export const metadata = {
  title: 'Dashboard: Dzongkhag Management'
};

export default async function DzongkhagManagementPage() {
  return (
    <PageContainer
      pageTitle="Dzongkhag Management"
      pageDescription="Manage dzongkhags in the system."
      pageHeaderAction={<AddDzongkhagButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <DzongkhagTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function DzongkhagTable() {
  const result = await getDzongkhags();

  // Handle the structure returned by getDzongkhags in dzongkhag-actions.ts
  const dzongkhags = result.dzongkhags || [];
  const totalItems = result.totalDzongkhags || dzongkhags.length;

  return (
    <DataTable columns={columns} data={dzongkhags} totalItems={totalItems} />
  );
}
