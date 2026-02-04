import PageContainer from '@/components/layout/page-container';
import { getPermissions } from '@/actions/common/permission-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddPermissionButton } from './_components/add-permission-button';

export const metadata = {
  title: 'Dashboard: Permission Management'
};

export default async function PermissionManagementPage() {
  return (
    <PageContainer
      pageTitle="Permission Management"
      pageDescription="Manage system permissions and access controls."
      pageHeaderAction={<AddPermissionButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <PermissionsTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function PermissionsTable() {
  const result = await getPermissions();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const permissions = result.data || [];

  return (
    <DataTable
      columns={columns}
      data={permissions}
      totalItems={permissions.length}
    />
  );
}
