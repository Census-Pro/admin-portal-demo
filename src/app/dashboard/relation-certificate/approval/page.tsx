import PageContainer from '@/components/layout/page-container';
import { ApprovalTable } from './_components/approval-table';

export const metadata = {
  title: 'Dashboard: Relation Certificate - Approval'
};

export default function RelationCertificateApprovalPage() {
  return (
    <PageContainer
      pageTitle="Relation Certificate - Approval"
      pageDescription="Assessed applications with paid payment pending approval."
    >
      <ApprovalTable />
    </PageContainer>
  );
}
