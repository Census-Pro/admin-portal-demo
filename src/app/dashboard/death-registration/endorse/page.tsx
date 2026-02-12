import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/endorse-columns';

export const metadata = {
  title: 'Death Registration - Endorse'
};

// Dummy data - only showing registrations that need endorsement (SUBMITTED status)
const endorsementList = [
  {
    id: '1',
    first_name: 'Pema',
    middle_name: 'Dorji',
    last_name: 'Tshering',
    deceased_cid: '10203004567',
    date_of_death: '2026-01-15',
    status: 'SUBMITTED',
    created_at: '2026-01-16T09:20:00Z'
  },
  {
    id: '4',
    first_name: 'Sonam',
    middle_name: 'Choden',
    last_name: 'Wangdi',
    deceased_cid: '10405007890',
    date_of_death: '2026-01-20',
    status: 'SUBMITTED',
    created_at: '2026-01-21T14:30:00Z'
  },
  {
    id: '6',
    first_name: 'Tashi',
    last_name: 'Namgyal',
    deceased_cid: '11206005432',
    date_of_death: '2026-02-05',
    status: 'SUBMITTED',
    created_at: '2026-02-06T11:45:00Z'
  }
];

export default function DeathRegistrationEndorsePage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Endorse"
      pageDescription="Review and endorse death registration applications pending endorsement"
    >
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={endorsementList}
          totalItems={endorsementList.length}
        />
      </div>
    </PageContainer>
  );
}
