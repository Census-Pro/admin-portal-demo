import PageContainer from '@/components/layout/page-container';
import { approveListColumns } from './_components/approve-list-columns';
import { ApproveListSearchBar } from './_components/search-bar';
import { ApproveListTable } from './_components/approve-list-table';

export const metadata = {
  title: 'Birth Registration - Approve List'
};

export default function BirthRegistrationApproveListPage() {
  return (
    <PageContainer
      pageTitle="Birth Registration - Approve List"
      pageDescription="Birth registration applications that have been approved"
    >
      <div className="space-y-4">
        <ApproveListSearchBar />
        <ApproveListTable columns={approveListColumns} />
      </div>
    </PageContainer>
  );
}
