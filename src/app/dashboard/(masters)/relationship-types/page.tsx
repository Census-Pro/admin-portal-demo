import PageContainer from '@/components/layout/page-container';
import { getRelationships } from '@/actions/common/relationship-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddRelationshipButton } from './_components/add-relationship-button';

export const metadata = {
  title: 'Dashboard: Relationship Management'
};

export default async function RelationshipManagementPage() {
  return (
    <PageContainer
      pageTitle="Relationship Management"
      pageDescription="Manage relationship types in the system."
      pageHeaderAction={<AddRelationshipButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
        >
          <RelationshipsTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function RelationshipsTable() {
  const result = await getRelationships();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const relationships = result.data || [];
  const totalItems = result.meta?.itemCount ?? relationships.length;

  return (
    <DataTable columns={columns} data={relationships} totalItems={totalItems} />
  );
}
