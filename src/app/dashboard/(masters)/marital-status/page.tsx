import PageContainer from '@/components/layout/page-container';
import { getMaritalStatuses } from '@/actions/common/marital-status-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddMaritalStatusButton } from './_components/add-marital-status-button';

export const metadata = {
  title: 'Dashboard: Marital Status Management'
};

export default async function MaritalStatusManagementPage() {
  return (
    <PageContainer
      pageTitle="Marital Status Management"
      pageDescription="Manage marital statuses in the system."
      pageHeaderAction={<AddMaritalStatusButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <MaritalStatusTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function MaritalStatusTable() {
  const result = await getMaritalStatuses();

  const maritalStatuses = result.maritalStatuses || [];
  const totalItems = result.totalMaritalStatuses || maritalStatuses.length;

  return (
    <DataTable
      columns={columns}
      data={maritalStatuses}
      totalItems={totalItems}
    />
  );
}
