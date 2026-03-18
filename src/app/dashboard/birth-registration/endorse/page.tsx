import PageContainer from '@/components/layout/page-container';
import { columns } from './_components/endorse-columns';
import { EndorseSearchBar } from './_components/search-bar';
import { BirthApplicationsTable } from '../_components/birth-applications-table';

export const metadata = {
  title: 'Birth Registration - Endorse'
};

export default function BirthRegistrationEndorsePage() {
  return (
    <PageContainer
      pageTitle="Birth Registration - Endorse"
      pageDescription="Review and endorse birth registration applications pending endorsement"
    >
      <div className="space-y-4">
        <EndorseSearchBar />
        <BirthApplicationsTable status="SUBMITTED" columns={columns} />
      </div>
    </PageContainer>
  );
}
