import PageContainer from '@/components/layout/page-container';
import { getUsers } from '@/actions/common/user-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddUserButton } from './_components/add-user-button';
import { UsersSearchBar } from './_components/search-bar';
import { User, BackendAdmin } from '@/types/user';

export const metadata = {
  title: 'Dashboard: User Management'
};

type SearchParams = Promise<{
  page?: string;
  limit?: string;
  q?: string;
}>;

export default async function UserManagementPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;
  const q = searchParams.q || '';

  return (
    <PageContainer
      pageTitle="User Management"
      pageDescription="Manage user access and account details."
      pageHeaderAction={<AddUserButton />}
    >
      <div className="space-y-4">
        <UsersSearchBar />
        <Suspense
          key={`${page}-${limit}-${q}`}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <UsersTable page={page} limit={limit} search={q} />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function UsersTable({
  page,
  limit,
  search
}: {
  page: number;
  limit: number;
  search: string;
}) {
  const result = await getUsers(page, limit, search);

  if (!result.success) {
    return (
      <div className="border-border/40 bg-card space-y-2 rounded-lg border p-8 text-center shadow-sm">
        <p className="font-semibold text-red-500">
          {result.error || 'Failed to load users'}
        </p>
        <p className="text-muted-foreground text-sm">
          Please check the console for more details or try refreshing the page.
        </p>
      </div>
    );
  }

  // Backend data to frontend User type
  const users: User[] = (result.data || []).map((admin: BackendAdmin) => ({
    id: admin.id,
    name: admin.cidNo || admin.name || admin.id || 'Unknown',
    email: admin.email || '',
    role: admin.role || admin.roleType || 'Unknown',
    agencyName:
      admin.agencyName ||
      admin.agency?.name ||
      admin.agency?.agencyName ||
      'N/A',
    officeLocationName:
      admin.officeLocationName ||
      admin.officeLocation?.name ||
      admin.officeLocation?.locationName ||
      'N/A'
  }));

  return (
    <DataTable columns={columns} data={users} totalItems={result.count || 0} />
  );
}
