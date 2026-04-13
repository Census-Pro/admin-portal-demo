import PageContainer from '@/components/layout/page-container';
import { columns } from './_components/endorse-columns';
import { EndorseSearchBar } from './_components/search-bar';
import { DeathApplicationsTable } from '../_components/death-applications-table';
import { getSubmittedDeathApplications } from '@/actions/common/death-registration-actions';

export const metadata = {
  title: 'Death Registration - Verify'
};

export default function DeathRegistrationEndorsePage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Verify"
      pageDescription="Review and verify death registration applications pending verification"
    >
      <div className="space-y-4">
        <EndorseSearchBar />
        <DeathApplicationsTable
          columns={columns}
          fetchFn={getSubmittedDeathApplications}
        />
      </div>
    </PageContainer>
  );
}
