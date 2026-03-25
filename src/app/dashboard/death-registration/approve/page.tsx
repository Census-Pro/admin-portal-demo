import PageContainer from '@/components/layout/page-container';
import { columns } from './_components/approve-columns';
import { ApproveSearchBar } from './_components/search-bar';
import { DeathApplicationsTable } from '../_components/death-applications-table';
import { getUnassignedDeathApplications } from '@/actions/common/death-registration-actions';

export const metadata = {
  title: 'Death Registration - Approve'
};

export default function DeathRegistrationApprovePage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Approve"
      pageDescription="Review and approve unassigned death registration applications"
    >
      <div className="space-y-4">
        <ApproveSearchBar />
        <DeathApplicationsTable
          columns={columns}
          fetchFn={getUnassignedDeathApplications}
        />
      </div>
    </PageContainer>
  );
}
