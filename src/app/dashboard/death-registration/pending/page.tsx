import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/pending-columns';
import { PendingSearchBar } from './_components/search-bar';

export const metadata = {
  title: 'Death Registration - Pending Applications'
};

// Dummy data - showing all pending death registration applications (SUBMITTED status)
const pendingList = [
  {
    id: '1',
    first_name: 'Pema',
    last_name: 'Wangchuk',
    deceased_cid: '10902003456',
    date_of_death: '2026-02-01',
    status: 'SUBMITTED',
    created_at: '2026-02-02T09:15:00Z'
  },
  {
    id: '2',
    first_name: 'Sangay',
    last_name: 'Dorji',
    deceased_cid: '11505001234',
    date_of_death: '2026-01-25',
    status: 'SUBMITTED',
    created_at: '2026-01-26T14:40:00Z'
  },
  {
    id: '3',
    first_name: 'Dechen',
    last_name: 'Wangmo',
    deceased_cid: '10101007890',
    date_of_death: '2026-01-15',
    status: 'SUBMITTED',
    created_at: '2026-01-16T11:20:00Z'
  }
];
export default function DeathRegistrationPendingPage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Pending Applications"
      pageDescription="View all pending death registration applications"
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
