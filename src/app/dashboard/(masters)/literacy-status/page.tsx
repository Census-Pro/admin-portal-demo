import PageContainer from '@/components/layout/page-container';
import { getLiteracyStatuses } from '@/actions/common/literacy-status-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddLiteracyStatusButton } from './_components/add-literacy-status-button';

export const metadata = {
  title: 'Dashboard: Literacy Status Management'
};

export default async function LiteracyStatusManagementPage() {
  return (
    <PageContainer
      pageTitle="Literacy Status Management"
      pageDescription="Manage literacy statuses in the system."
      pageHeaderAction={<AddLiteracyStatusButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <LiteracyStatusTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function LiteracyStatusTable() {
  const result = await getLiteracyStatuses();

  const literacyStatuses = result.literacyStatuses || [];
  const totalItems = result.totalLiteracyStatuses || literacyStatuses.length;

  return (
    <DataTable
      columns={columns}
      data={literacyStatuses}
      totalItems={totalItems}
    />
  );
}
