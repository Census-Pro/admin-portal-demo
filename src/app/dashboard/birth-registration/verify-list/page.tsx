import PageContainer from '@/components/layout/page-container';
import { verifyListColumns } from './_components/verify-list-columns';
import { VerifyListSearchBar } from './_components/search-bar';
import { VerifyListTable } from './_components/verify-list-table';

export const metadata = {
  title: 'Birth Registration - Verify List'
};

export default function BirthRegistrationVerifyListPage() {
  return (
    <PageContainer
      pageTitle="Birth Registration - Verify List"
      pageDescription="Birth registration applications that have been verified"
    >
      <div className="space-y-4">
        <VerifyListSearchBar />
        <VerifyListTable columns={verifyListColumns} />
      </div>
    </PageContainer>
  );
}
