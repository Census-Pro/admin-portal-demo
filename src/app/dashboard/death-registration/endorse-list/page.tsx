import PageContainer from '@/components/layout/page-container';
import { endorseListColumns } from './_components/endorse-list-columns';
import { EndorseListSearchBar } from './_components/search-bar';
import { DeathApplicationsTable } from '../_components/death-applications-table';
import { getSubmittedDeathApplications } from '@/actions/common/death-registration-actions';

export const metadata = {
  title: 'Death Registration - Endorse List'
};

export default function DeathRegistrationEndorseListPage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Endorse List"
      pageDescription="Death registration applications that have been endorsed"
    >
      <div className="space-y-4">
        <EndorseListSearchBar />
        <DeathApplicationsTable
          columns={endorseListColumns}
          fetchFn={getSubmittedDeathApplications}
        />
      </div>
    </PageContainer>
  );
}
