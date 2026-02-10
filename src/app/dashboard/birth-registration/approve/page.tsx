import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/approve-columns';

export const metadata = {
  title: 'Birth Registration - Approve (HQ)'
};

// Dummy data - only showing registrations that are verified and need approval
const approvalList = [
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
    id: '7',
    first_name: 'Tenzin',
    last_name: 'Namgyal',
    applicant_cid: '10208007890',
    date_of_birth: '2026-01-22',
    status: 'VERIFIED',
    created_at: '2026-01-23T10:15:00Z'
  },
  {
    id: '8',
    first_name: 'Sangay',
    middle_name: 'Choden',
    last_name: 'Dorji',
    applicant_cid: '11506009012',
    date_of_birth: '2026-02-06',
    status: 'VERIFIED',
    created_at: '2026-02-07T13:30:00Z'
  }
];

export default function BirthRegistrationApprovePage() {
  return (
    <PageContainer
      pageTitle="Birth Registration - Approve (HQ)"
      pageDescription="Review and approve verified birth registration applications"
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
