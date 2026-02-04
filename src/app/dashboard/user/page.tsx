import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddUserButton } from './_components/add-user-button';
import { UsersSearchBar } from './_components/search-bar';
import { UsersTable } from './_components/users-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: User Management'
};

export default function UserManagementPage() {
  return (
    <PageContainer
      pageTitle="User Management"
      pageDescription="Manage user access and account details."
      pageHeaderAction={<AddUserButton />}
    >
      <div className="space-y-4">
        <UsersSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <UsersTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
