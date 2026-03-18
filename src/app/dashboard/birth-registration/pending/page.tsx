import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/pending-columns';
import { PendingSearchBar } from './_components/search-bar';
import { getBirthApplicationsByStatus } from '@/actions/common/birth-registration-actions';

export const metadata = {
  title: 'Birth Registration - Pending Applications'
};

export default async function BirthRegistrationPendingPage() {
  const result = await getBirthApplicationsByStatus('SUBMITTED');
  const pendingList = result.data ?? [];

  return (
    <PageContainer
      pageTitle="Birth Registration - Pending Applications"
      pageDescription="View all pending birth registration applications"
    >
      <div className="space-y-4">
        <PendingSearchBar />
        <DataTable
          columns={columns}
          data={pendingList}
          totalItems={result.total_count ?? pendingList.length}
        />
      </div>
    </PageContainer>
  );
}
