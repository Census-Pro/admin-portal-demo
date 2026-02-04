import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddPermissionButton } from './_components/add-permission-button';
import { PermissionsTable } from './_components/permissions-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Permission Management'
};

export default function PermissionManagementPage() {
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
