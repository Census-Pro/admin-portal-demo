import PageContainer from '@/components/layout/page-container';
import { getRegularizationTypes } from '@/actions/common/regularization-type-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddRegularizationTypeButton } from './_components/add-regularization-type-button';

export const metadata = {
  title: 'Dashboard: Regularization Type Management'
};

export default async function RegularizationTypeManagementPage() {
  return (
    <PageContainer
      pageTitle="Regularization Type Management"
      pageDescription="Manage regularization types in the system."
      pageHeaderAction={<AddRegularizationTypeButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <RegularizationTypeTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function RegularizationTypeTable() {
  const result = await getRegularizationTypes();

  // Handle the structure returned by getRegularizationTypes
  const regularizationTypes = result.data || [];
  const totalItems = result.totalItems || regularizationTypes.length;

  return (
    <DataTable
      columns={columns}
      data={regularizationTypes}
      totalItems={totalItems}
    />
  );
}
