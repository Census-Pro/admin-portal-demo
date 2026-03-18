import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/approve-columns';
import { ApproveSearchBar } from './_components/search-bar';
import { getBirthApplicationsByStatus } from '@/actions/common/birth-registration-actions';

export const metadata = {
  title: 'Birth Registration - Approve'
};

export default async function BirthRegistrationApprovePage() {
  const result = await getBirthApplicationsByStatus('VERIFIED');
  const approvalList = result.data ?? [];

  return (
    <PageContainer
      pageTitle="Birth Registration - Approve"
      pageDescription="Review and approve verified birth registration applications"
    >
      <div className="space-y-4">
        <ApproveSearchBar />
        <DataTable
          columns={columns}
          data={approvalList}
          totalItems={result.total_count ?? approvalList.length}
        />
      </div>
    </PageContainer>
  );
}
