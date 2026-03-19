import PageContainer from '@/components/layout/page-container';
import { columns } from './_components/approve-columns';
import { ApproveSearchBar } from './_components/search-bar';
import { BirthApplicationsTable } from '../_components/birth-applications-table';

export const metadata = {
  title: 'Birth Registration - Approve'
};

export default function BirthRegistrationApprovePage() {
  return (
    <PageContainer
      pageTitle="Birth Registration - Approve"
      pageDescription="Review and approve verified birth registration applications"
    >
      <div className="space-y-4">
        <ApproveSearchBar />
        <BirthApplicationsTable
          status={['VERIFIED', 'APPROVED']}
          columns={columns}
        />
      </div>
    </PageContainer>
  );
}
