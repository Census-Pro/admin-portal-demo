import PageContainer from '@/components/layout/page-container';
import { getRelationshipCertificatePurposes } from '@/actions/common/relationship-certificate-purpose-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddRelationshipCertificatePurposeButton } from './_components/add-relationship-certificate-purpose-button';

export const metadata = {
  title: 'Dashboard: Relationship Certificate Purpose Management'
};

export default async function RelationshipCertificatePurposeManagementPage() {
  return (
    <PageContainer
      pageTitle="Relationship Certificate Purpose Management"
      pageDescription="Manage relationship certificate purposes in the system."
      pageHeaderAction={<AddRelationshipCertificatePurposeButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <RelationshipCertificatePurposeTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function RelationshipCertificatePurposeTable() {
  const result = await getRelationshipCertificatePurposes();

  // Handle the structure returned by getRelationshipCertificatePurposes
  const relationshipCertificatePurposes = result.data || [];
  const totalItems =
    result.totalItems || relationshipCertificatePurposes.length;

  return (
    <DataTable
      columns={columns}
      data={relationshipCertificatePurposes}
      totalItems={totalItems}
    />
  );
}
