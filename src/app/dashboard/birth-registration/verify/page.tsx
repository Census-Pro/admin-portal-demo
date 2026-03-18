import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/verify-columns';
import { VerifySearchBar } from './_components/search-bar';
import { getBirthApplicationsByStatus } from '@/actions/common/birth-registration-actions';

export const metadata = {
  title: 'Birth Registration - Verify'
};

export default async function BirthRegistrationVerifyPage() {
  const result = await getBirthApplicationsByStatus('ENDORSED');
  const verificationList = result.data ?? [];

  return (
    <PageContainer
      pageTitle="Birth Registration - Verify (LG)"
      pageDescription="Review and verify birth registration applications pending verification"
    >
      <div className="space-y-4">
        <VerifySearchBar />
        <DataTable
          columns={columns}
          data={verificationList}
          totalItems={result.total_count ?? verificationList.length}
        />
      </div>
    </PageContainer>
  );
}
