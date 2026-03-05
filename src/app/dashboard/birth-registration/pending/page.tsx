import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/pending-columns';
import { PendingSearchBar } from './_components/search-bar';

export const metadata = {
  title: 'Birth Registration - Pending Applications'
};

// Dummy data - showing all pending applications (SUBMITTED status)
const pendingList = [
  {
    id: '1',
    first_name: 'Jigme',
    middle_name: 'Phuntsho',
    last_name: 'Chonjure',
    applicant_cid: '10304001088',
    date_of_birth: '2026-02-04',
    status: 'SUBMITTED',
    created_at: '2026-02-05T10:30:00Z'
  },
  {
    id: '4',
    first_name: 'Karma',
    middle_name: 'Lhamo',
    last_name: 'Namgyal',
    applicant_cid: '10507008901',
    date_of_birth: '2026-01-28',
    status: 'SUBMITTED',
    created_at: '2026-01-29T16:45:00Z'
  },
  {
    id: '6',
    first_name: 'Dorji',
    last_name: 'Wangmo',
    applicant_cid: '11305006789',
    date_of_birth: '2026-02-08',
    status: 'SUBMITTED',
    created_at: '2026-02-09T08:20:00Z'
  }
];

export default function BirthRegistrationPendingPage() {
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
          totalItems={pendingList.length}
        />
      </div>
    </PageContainer>
  );
}
