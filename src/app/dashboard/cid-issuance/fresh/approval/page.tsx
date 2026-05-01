import PageContainer from '@/components/layout/page-container';
import { CidApprovalTable } from './_components/approval-table';

export const metadata = {
  title: 'Dashboard: Fresh CID - Approval'
};

export default function FreshApprovalPage() {
  return (
    <PageContainer
      pageTitle="Fresh CID - Final Approval"
      pageDescription="Final approval of new CID applications before card production."
    >
      <CidApprovalTable />
    </PageContainer>
  );
}
