import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/approve-columns';

export const metadata = {
  title: 'Death Registration - Approve'
};

// Dummy data - only showing registrations ready for approval (VERIFIED status)
const approvalList = [
  {
    id: '2',
    first_name: 'Kinley',
    middle_name: 'Zangmo',
    last_name: 'Dorji',
    deceased_cid: '10304002345',
    date_of_death: '2026-01-18',
    status: 'VERIFIED',
    created_at: '2026-01-19T11:00:00Z',
    verified_at: '2026-01-22T10:30:00Z'
  },
  {
    id: '3',
    first_name: 'Ugyen',
    last_name: 'Penjor',
    deceased_cid: '10506009012',
    date_of_death: '2026-01-25',
    status: 'VERIFIED',
    created_at: '2026-01-26T13:20:00Z',
    verified_at: '2026-01-28T09:15:00Z'
  },
  {
    id: '7',
    first_name: 'Dechen',
    middle_name: 'Lhamo',
    last_name: 'Tshomo',
    deceased_cid: '11104003210',
    date_of_death: '2026-02-01',
    status: 'VERIFIED',
    created_at: '2026-02-02T15:40:00Z',
    verified_at: '2026-02-04T14:20:00Z'
  },
  {
    id: '8',
    first_name: 'Tashi',
    last_name: 'Wangdi',
    deceased_cid: '10903004567',
    date_of_death: '2026-01-30',
    status: 'APPROVED',
    created_at: '2026-01-31T09:00:00Z',
    verified_at: '2026-02-02T16:30:00Z'
  }
];

export default function DeathRegistrationApprovePage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Approve"
      pageDescription="Review and approve verified death registration applications"
    >
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={approvalList}
          totalItems={approvalList.length}
        />
      </div>
    </PageContainer>
  );
}
