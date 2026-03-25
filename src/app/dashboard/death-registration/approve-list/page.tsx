import PageContainer from '@/components/layout/page-container';
import { approveListColumns } from './_components/approve-list-columns';
import { ApproveListSearchBar } from './_components/search-bar';
import { DeathApplicationsTable } from '../_components/death-applications-table';
import { getMyDeathTaskList } from '@/actions/common/death-registration-actions';

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
        <DeathApplicationsTable
          columns={approveListColumns}
          fetchFn={getMyDeathTaskList}
        />
      </div>
    </PageContainer>
  );
}
