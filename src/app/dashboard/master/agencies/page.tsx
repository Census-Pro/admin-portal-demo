import PageContainer from '@/components/layout/page-container';
import { getAgencies } from '@/actions/common/agency-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddAgencyButton } from './_components/add-agency-button';

export const metadata = {
  title: 'Dashboard: Agency Management'
};

export default async function AgencyManagementPage() {
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

async function AgenciesTable() {
  const result = await getAgencies();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const agencies = result.data || [];

  return (
    <DataTable columns={columns} data={agencies} totalItems={agencies.length} />
  );
}
