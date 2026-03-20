import PageContainer from '@/components/layout/page-container';
import { columns } from './_components/approve-columns';
import { ApproveSearchBar } from './_components/search-bar';
import { DeathApplicationsTable } from '../_components/death-applications-table';

export const metadata = {
  title: 'Death Registration - Approve'
};

export default function DeathRegistrationApprovePage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Approve"
      pageDescription="Review and approve verified death registration applications"
    >
      <div className="space-y-4">
        <ApproveSearchBar />
        <DeathApplicationsTable
          status={['APPROVED', 'VERIFIED']}
          columns={columns}
        />
      </div>
    </PageContainer>
  );
}
