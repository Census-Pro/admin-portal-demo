import PageContainer from '@/components/layout/page-container';
import { getGenders } from '@/actions/common/gender-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddGenderButton } from './_components/add-gender-button';

export const metadata = {
  title: 'Dashboard: Gender Management'
};

export default async function GenderManagementPage() {
  return (
    <PageContainer
      pageTitle="Gender Management"
      pageDescription="Manage genders in the system."
      pageHeaderAction={<AddGenderButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <GenderTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function GenderTable() {
  const result = await getGenders();

  const genders = result.genders || [];
  const totalItems = result.totalGenders || genders.length;

  return <DataTable columns={columns} data={genders} totalItems={totalItems} />;
}
