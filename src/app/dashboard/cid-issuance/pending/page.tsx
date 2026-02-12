import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from '../_components/columns';

export const metadata = {
  title: 'Dashboard: CID Issuance - Pending Applications'
};

// Dummy data for testing - representing CID applications at different stages
const dummyCIDApplications = [
  {
    id: '1',
    applicant_name: 'Tshering Dorji',
    date_of_birth: '2008-03-15',
    gender: 'Male',
    dzongkhag: 'Thimphu',
    gewog: 'Chang',
    application_type: 'NEW' as const,
    status: 'SUBMITTED',
    created_at: '2026-02-10T09:30:00Z',
    phone_number: '17123456',
    email: 'tshering.dorji@gmail.com'
  },
  {
    id: '2',
    applicant_name: 'Pema Lhamo',
    date_of_birth: '2008-07-22',
    gender: 'Female',
    dzongkhag: 'Paro',
    gewog: 'Shaba',
    application_type: 'NEW' as const,
    status: 'SUBMITTED',
    created_at: '2026-02-09T14:20:00Z',
    phone_number: '17234567',
    email: 'pema.lhamo@email.bt'
  },
  {
    id: '3',
    applicant_name: 'Kinley Wangchuk',
    applicant_cid: '11505003456',
    date_of_birth: '1995-05-10',
    gender: 'Male',
    dzongkhag: 'Punakha',
    gewog: 'Guma',
    application_type: 'RENEWAL' as const,
    status: 'SUBMITTED',
    created_at: '2026-02-11T11:00:00Z',
    phone_number: '17345678'
  },
  {
    id: '4',
    applicant_name: 'Sonam Choden',
    applicant_cid: '10803007890',
    date_of_birth: '1998-08-18',
    gender: 'Female',
    dzongkhag: 'Bumthang',
    gewog: 'Chhoekhor',
    application_type: 'REPLACEMENT' as const,
    status: 'SUBMITTED',
    created_at: '2026-02-08T16:45:00Z',
    phone_number: '17456789',
    email: 'sonam.choden@bt.bt'
  },
  {
    id: '5',
    applicant_name: 'Ugyen Tshomo',
    applicant_cid: '11102005678',
    date_of_birth: '2000-02-25',
    gender: 'Female',
    dzongkhag: 'Wangdue Phodrang',
    gewog: 'Athang',
    application_type: 'UPDATE' as const,
    status: 'SUBMITTED',
    created_at: '2026-02-07T10:15:00Z',
    phone_number: '17567890'
  },
  {
    id: '6',
    applicant_name: 'Chencho Namgay',
    date_of_birth: '2008-11-30',
    gender: 'Male',
    dzongkhag: 'Trashigang',
    gewog: 'Khaling',
    application_type: 'NEW' as const,
    status: 'SUBMITTED',
    created_at: '2026-02-12T08:30:00Z',
    phone_number: '17678901',
    email: 'chencho.namgay@yahoo.com'
  }
];

export default function PendingApplicationsPage() {
  return (
    <PageContainer
      pageTitle="Pending CID Applications"
      pageDescription="Review and process pending citizenship identity document applications."
    >
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={dummyCIDApplications}
          totalItems={dummyCIDApplications.length}
        />
      </div>
    </PageContainer>
  );
}
