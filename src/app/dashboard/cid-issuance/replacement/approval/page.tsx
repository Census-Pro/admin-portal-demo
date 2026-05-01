import PageContainer from '@/components/layout/page-container';
import { CidReplacementApprovalTable } from './_components/approval-table';

export const metadata = {
  title: 'Dashboard: CID Replacement - Approval'
};

export default function ReplacementApprovalPage() {
  return (
    <PageContainer
      pageTitle="CID Replacement - Final Approval"
      pageDescription="Final approval of CID replacement applications before card production."
    >
      <CidReplacementApprovalTable />
    </PageContainer>
  );
}
