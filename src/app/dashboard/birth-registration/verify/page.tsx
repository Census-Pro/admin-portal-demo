import PageContainer from '@/components/layout/page-container';
import { columns } from './_components/verify-columns';
import { VerifySearchBar } from './_components/search-bar';
import { BirthApplicationsTable } from '../_components/birth-applications-table';

export const metadata = {
  title: 'Birth Registration - Verify'
};

export default function BirthRegistrationVerifyPage() {
  return (
    <PageContainer
      pageTitle="Birth Registration - Verify (LG)"
      pageDescription="Review and verify birth registration applications pending verification"
    >
      <div className="space-y-4">
        <VerifySearchBar />
        <BirthApplicationsTable status="SUBMITTED" columns={columns} />
      </div>
    </PageContainer>
  );
}
