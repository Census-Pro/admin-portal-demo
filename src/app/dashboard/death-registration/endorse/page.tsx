import PageContainer from '@/components/layout/page-container';
import { columns } from './_components/endorse-columns';
import { EndorseSearchBar } from './_components/search-bar';
import { DeathApplicationsTable } from '../_components/death-applications-table';
import { getSubmittedDeathApplications } from '@/actions/common/death-registration-actions';

export const metadata = {
  title: 'Death Registration - Endorse'
};

export default function DeathRegistrationEndorsePage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Endorse"
      pageDescription="Review and endorse death registration applications pending endorsement"
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
