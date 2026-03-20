import PageContainer from '@/components/layout/page-container';
import { approveListColumns } from './_components/approve-list-columns';
import { ApproveListSearchBar } from './_components/search-bar';
import { DeathApplicationsTable } from '../_components/death-applications-table';

export const metadata = {
  title: 'Death Registration - Approve List'
};

export default function DeathRegistrationApproveListPage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Approve List"
      pageDescription="Death registration applications that have been approved"
    >
      <div className="space-y-4">
        <ApproveListSearchBar />
        <DeathApplicationsTable
          status={['APPROVED', 'VERIFIED']}
          columns={approveListColumns}
        />
      </div>
    </PageContainer>
  );
}
