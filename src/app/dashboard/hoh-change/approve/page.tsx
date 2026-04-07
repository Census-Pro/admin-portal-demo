import PageContainer from '@/components/layout/page-container';
import { columns } from '../_components/columns';
import { HohChangeApproveTable } from '../_components/hoh-change-approve-table';

export const metadata = {
  title: 'Dashboard: HOH Change Approve'
};

export default function HohChangeApprovePage() {
  return (
    <PageContainer
      pageTitle="HOH Change Approval"
      pageDescription="Review and approve head of household change applications"
    >
      <div className="space-y-4">
        <HohChangeApproveTable columns={columns} />
      </div>
    </PageContainer>
  );
}
