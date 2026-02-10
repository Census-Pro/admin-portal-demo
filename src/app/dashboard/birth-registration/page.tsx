import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';

export const metadata = {
  title: 'Dashboard: Birth Registration'
};

// Dummy data for testing
const dummyBirthRegistrations = [
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
    id: '2',
    first_name: 'Pema',
    middle_name: 'Dorji',
    last_name: 'Wangchuk',
    applicant_cid: '11101002345',
    date_of_birth: '2026-01-15',
    status: 'VERIFIED',
    created_at: '2026-01-16T14:20:00Z'
  },
  {
    id: '3',
    first_name: 'Sonam',
    last_name: 'Tshering',
    applicant_cid: '12003004567',
    date_of_birth: '2025-12-20',
    status: 'APPROVED',
    created_at: '2025-12-21T09:15:00Z'
  },
  {
    id: '4',
    first_name: 'Karma',
    middle_name: 'Lhamo',
    last_name: 'Namgyal',
    applicant_cid: '10507008901',
    date_of_birth: '2026-01-28',
    status: 'PENDING',
    created_at: '2026-01-29T16:45:00Z'
  },
  {
    id: '5',
    first_name: 'Tashi',
    last_name: 'Dema',
    applicant_cid: '11204005678',
    date_of_birth: '2026-02-01',
    status: 'REJECTED',
    created_at: '2026-02-02T11:00:00Z'
  }
];

export default function BirthRegistrationPage() {
  return (
    <PageContainer
      pageTitle="Birth Registration"
      pageDescription="View and manage birth registration applications."
    >
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={dummyBirthRegistrations}
          totalItems={dummyBirthRegistrations.length}
        />
      </div>
    </PageContainer>
  );
}
