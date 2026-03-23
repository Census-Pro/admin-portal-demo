import PageContainer from '@/components/layout/page-container';
import { verifyListColumns } from './_components/verify-list-columns';
import { VerifyListSearchBar } from './_components/search-bar';
import { DeathApplicationsTable } from '../_components/death-applications-table';
import { getEndorsedDeathApplications } from '@/actions/common/death-registration-actions';

export const metadata = {
  title: 'Death Registration - Verify List'
};

export default function DeathRegistrationVerifyListPage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Verify List"
      pageDescription="Death registration applications that have been verified"
    >
      <div className="space-y-4">
        <VerifyListSearchBar />
        <DeathApplicationsTable
          columns={verifyListColumns}
          fetchFn={getEndorsedDeathApplications}
        />
      </div>
    </PageContainer>
  );
}
