import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddRelationshipButton } from './_components/add-relationship-button';
import { RelationshipsTable } from './_components/relationships-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Relationship Management'
};

export default function RelationshipManagementPage() {
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
