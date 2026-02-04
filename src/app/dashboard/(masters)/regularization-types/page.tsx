import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddRegularizationTypeButton } from './_components/add-regularization-type-button';
import { RegularizationTypesTable } from './_components/regularization-types-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Regularization Type Management'
};

export default function RegularizationTypeManagementPage() {
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
          <RegularizationTypesTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
