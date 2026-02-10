import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';

export const metadata = {
  title: 'Dashboard: Death Registration'
};

// Dummy data for testing
const dummyDeathRegistrations = [
  {
    id: '1',
    first_name: 'Tshering',
    middle_name: 'Dorji',
    last_name: 'Wangchuk',
    applicant_cid: '10304001088',
    date_of_death: '2026-01-15',
    status: 'SUBMITTED',
    created_at: '2026-01-16T10:30:00Z'
  },
  {
    id: '2',
    first_name: 'Karma',
    middle_name: 'Phuntsho',
    last_name: 'Namgyal',
    applicant_cid: '11101002345',
    date_of_death: '2025-12-28',
    status: 'VERIFIED',
    created_at: '2025-12-29T14:20:00Z'
  },
  {
    id: '3',
    first_name: 'Pema',
    last_name: 'Lhamo',
    applicant_cid: '12003004567',
    date_of_death: '2026-01-05',
    status: 'APPROVED',
    created_at: '2026-01-06T09:15:00Z'
  },
  {
    id: '4',
    first_name: 'Sonam',
    middle_name: 'Tashi',
    last_name: 'Dema',
    applicant_cid: '10507008901',
    date_of_death: '2026-02-01',
    status: 'PENDING',
    created_at: '2026-02-02T16:45:00Z'
  },
  {
    id: '5',
    first_name: 'Jigme',
    last_name: 'Tshering',
    applicant_cid: '11204005678',
    date_of_death: '2026-01-20',
    status: 'REJECTED',
    created_at: '2026-01-21T11:00:00Z'
  }
];

export default function DeathRegistrationPage() {
  return (
    <PageContainer
      pageTitle="Death Registration"
      pageDescription="View and manage death registration applications."
    >
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={dummyDeathRegistrations}
          totalItems={dummyDeathRegistrations.length}
        />
      </div>
    </PageContainer>
  );
}
