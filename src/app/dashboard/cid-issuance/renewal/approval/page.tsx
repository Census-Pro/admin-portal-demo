import PageContainer from '@/components/layout/page-container';
import { CidRenewalApprovalTable } from './_components/approval-table';

export const metadata = {
  title: 'Dashboard: CID Renewal - Approval'
};

export default function RenewalApprovalPage() {
  return (
    <PageContainer
      pageTitle="CID Renewal - Final Approval"
      pageDescription="Final approval of CID renewal applications before card production."
    >
      <CidRenewalApprovalTable />
    </PageContainer>
  );
}
