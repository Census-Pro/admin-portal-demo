import PageContainer from '@/components/layout/page-container';
import { ApprovalTable } from './_components/approval-table';
import { ApprovalSearchBar } from './_components/search-bar';

export const metadata = {
  title: 'Dashboard: Relation Certificate - Approval'
};

export default function RelationCertificateApprovalPage() {
  return (
    <PageContainer
      pageTitle="Relation Certificate - Approval"
      pageDescription="Assessed applications with paid payment pending approval."
    >
      <div className="space-y-4">
        <ApprovalSearchBar />
        <ApprovalTable />
      </div>
    </PageContainer>
  );
}
