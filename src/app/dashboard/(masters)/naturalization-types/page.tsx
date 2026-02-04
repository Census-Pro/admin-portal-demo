import PageContainer from '@/components/layout/page-container';
import { getNaturalizationTypes } from '@/actions/common/naturalization-type-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddNaturalizationTypeButton } from './_components/add-naturalization-type-button';

export const metadata = {
  title: 'Dashboard: Naturalization Type Management'
};

export default async function NaturalizationTypeManagementPage() {
  return (
    <PageContainer
      pageTitle="Naturalization Type Management"
      pageDescription="Manage naturalization types in the system."
      pageHeaderAction={<AddNaturalizationTypeButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <NaturalizationTypeTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function NaturalizationTypeTable() {
  const result = await getNaturalizationTypes();

  // Handle the structure returned by getNaturalizationTypes
  const naturalizationTypes = result.data || [];
  const totalItems = result.totalItems || naturalizationTypes.length;

  return (
    <DataTable
      columns={columns}
      data={naturalizationTypes}
      totalItems={totalItems}
    />
  );
}
