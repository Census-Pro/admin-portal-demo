import PageContainer from '@/components/layout/page-container';
import { columns } from '../_components/columns';
import { HohChangeApproveTable } from '../_components/hoh-change-approve-table';

export const metadata = {
  title: 'Dashboard: HOH Change My Approve List'
};

export default function HohChangeApproveListPage() {
  return (
    <PageContainer
      pageTitle="My HOH Change Approval List"
      pageDescription="View head of household change applications assigned to you for approval"
    >
      <div className="space-y-4">
        <HohChangeApproveTable columns={columns} />
      </div>
    </PageContainer>
  );
}
