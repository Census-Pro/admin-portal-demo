import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddAgencyButton } from './_components/add-agency-button';
import { AgenciesTable } from './_components/agencies-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Agency Management'
};

export default function AgencyManagementPage() {
  return (
    <PageContainer
      pageTitle="Agency Management"
      pageDescription="Manage agencies in the system."
      pageHeaderAction={<AddAgencyButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
        >
          <AgenciesTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
