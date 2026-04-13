import PageContainer from '@/components/layout/page-container';
import { columns } from './_components/endorse-columns';
import { EndorseSearchBar } from './_components/search-bar';
import { BirthApplicationsTable } from '../_components/birth-applications-table';

export const metadata = {
  title: 'Birth Registration - Verify'
};

export default function BirthRegistrationEndorsePage() {
  return (
    <PageContainer
      pageTitle="Birth Registration - Verify"
      pageDescription="Review and verify birth registration applications pending verification"
    >
      <div className="space-y-4">
        <EndorseSearchBar />
        <BirthApplicationsTable status="ENDORSED" columns={columns} />
      </div>
    </PageContainer>
  );
}
