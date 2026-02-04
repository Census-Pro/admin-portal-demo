import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddGenderButton } from './_components/add-gender-button';
import { GendersTable } from './_components/genders-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Gender Management'
};

export default function GenderManagementPage() {
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
          <GendersTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
