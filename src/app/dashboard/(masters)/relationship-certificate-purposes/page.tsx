import PageContainer from '@/components/layout/page-container';
import { RelationshipCertificatePurposesSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddRelationshipCertificatePurposeButton } from './_components/add-relationship-certificate-purpose-button';
import { RelationshipCertificatePurposesTable } from './_components/relationship-certificate-purposes-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Relationship Certificate Purpose Management'
};

export default function RelationshipCertificatePurposeManagementPage() {
  return (
    <PageContainer
      pageTitle="Relationship Certificate Purpose Management"
      pageDescription="Manage relationship certificate purposes in the system."
      pageHeaderAction={<AddRelationshipCertificatePurposeButton />}
    >
      <div className="space-y-4">
        <RelationshipCertificatePurposesSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <RelationshipCertificatePurposesTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
