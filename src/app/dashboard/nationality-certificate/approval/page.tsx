import PageContainer from '@/components/layout/page-container';
import { NcApprovalTable } from './_components/approval-table';
import { ApprovalSearchBar } from './_components/search-bar';

export const metadata = {
  title: 'Dashboard: Nationality Certificate - Approval'
};

export default function NationalityCertificateApprovalPage() {
  return (
    <PageContainer
      pageTitle="Nationality Certificate - Approval"
      pageDescription="Assessed applications with paid payment pending approval."
    >
      <div className="space-y-4">
        <ApprovalSearchBar />
        <NcApprovalTable />
      </div>
    </PageContainer>
  );
}
