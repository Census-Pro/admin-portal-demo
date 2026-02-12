import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from '../_components/columns';

export const metadata = {
  title: 'Dashboard: CID Issuance - Approve'
};

// Dummy data for approval stage
const approvalData = [
  {
    id: '10',
    applicant_name: 'Karma Tshering',
    date_of_birth: '2008-01-08',
    gender: 'Male',
    dzongkhag: 'Dagana',
    gewog: 'Drujegang',
    application_type: 'NEW' as const,
    status: 'VERIFIED',
    created_at: '2026-01-28T11:15:00Z',
    phone_number: '17012345',
    email: 'karma.tshering@gmail.com'
  },
  {
    id: '11',
    applicant_name: 'Sangay Dema',
    applicant_cid: '11007010123',
    date_of_birth: '2000-07-30',
    gender: 'Female',
    dzongkhag: 'Tsirang',
    gewog: 'Tsirangtoe',
    application_type: 'RENEWAL' as const,
    status: 'VERIFIED',
    created_at: '2026-01-27T15:30:00Z',
    phone_number: '17123450'
  },
  {
    id: '12',
    applicant_name: 'Dorji Wangmo',
    applicant_cid: '10502011234',
    date_of_birth: '1995-02-14',
    gender: 'Female',
    dzongkhag: 'Zhemgang',
    gewog: 'Ngangla',
    application_type: 'REPLACEMENT' as const,
    status: 'VERIFIED',
    created_at: '2026-01-26T10:00:00Z',
    phone_number: '17234561',
    email: 'dorji.wangmo@email.bt'
  }
];

export default function ApprovePage() {
  return (
    <PageContainer
      pageTitle="Approve CID Applications"
      pageDescription="Final approval of verified CID applications before printing."
    >
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={approvalData}
          totalItems={approvalData.length}
        />
      </div>
    </PageContainer>
  );
}
