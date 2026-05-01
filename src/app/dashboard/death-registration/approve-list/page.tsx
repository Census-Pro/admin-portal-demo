import PageContainer from '@/components/layout/page-container';
import { approveListColumns } from './_components/approve-list-columns';
import { ApproveListSearchBar } from './_components/search-bar';
import { ApproveListTable } from './_components/approve-list-table';

export const metadata = {
  title: 'Death Registration - Approve List'
};

export default function DeathRegistrationApproveListPage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Approve List"
      pageDescription="Death registration applications assigned to you"
    >
      <div className="space-y-4">
        <ApproveListSearchBar />
        <ApproveListTable columns={approveListColumns} />
      </div>
    </PageContainer>
  );
}
