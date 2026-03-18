import PageContainer from '@/components/layout/page-container';
import { columns } from './_components/pending-columns';
import { PendingSearchBar } from './_components/search-bar';
import { BirthApplicationsTable } from '../_components/birth-applications-table';

export const metadata = {
  title: 'Birth Registration - Pending Applications'
};

export default function BirthRegistrationPendingPage() {
  return (
    <PageContainer
      pageTitle="Birth Registration - Pending Applications"
      pageDescription="View all pending birth registration applications"
    >
      <div className="space-y-4">
        <PendingSearchBar />
        <BirthApplicationsTable status="SUBMITTED" columns={columns} />
      </div>
    </PageContainer>
  );
}
