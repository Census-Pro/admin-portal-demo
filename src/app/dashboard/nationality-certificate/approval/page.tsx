import PageContainer from '@/components/layout/page-container';
import { NcApprovalTable } from './_components/approval-table';

export const metadata = {
  title: 'Dashboard: Nationality Certificate - Approval'
};

export default function NationalityCertificateApprovalPage() {
  return (
    <PageContainer
      pageTitle="Nationality Certificate - Approval"
      pageDescription="Assessed applications with paid payment pending approval."
    >
      <NcApprovalTable />
    </PageContainer>
  );
}
