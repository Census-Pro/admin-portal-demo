import PageContainer from '@/components/layout/page-container';
import { approveListColumns } from './_components/approve-list-columns';
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
        <HohChangeApproveTable columns={approveListColumns} />
      </div>
    </PageContainer>
  );
}
