import PageContainer from '@/components/layout/page-container';
import { getRoles } from '@/actions/common/role-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddRoleButton } from './_components/add-role-button';
import { RolesSearchBar } from './_components/search-bar';

export const metadata = {
  title: 'Dashboard: Role Management'
};

export default async function RoleManagementPage() {
  return (
    <PageContainer
      pageTitle="Role Management"
      pageDescription="Manage system roles and permissions."
      pageHeaderAction={<AddRoleButton />}
    >
      <div className="space-y-4">
        <RolesSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
        >
          <RolesTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function RolesTable() {
  const result = await getRoles();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const roles = result.data || [];

  return <DataTable columns={columns} data={roles} totalItems={roles.length} />;
}
