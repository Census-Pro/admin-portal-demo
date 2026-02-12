import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { printColumns } from '../_components/print-columns';

export const metadata = {
  title: 'Dashboard: CID Issuance - Print CID'
};

// Dummy data for approved applications ready to print
const printReadyData = [
  {
    id: '13',
    applicant_name: 'Tashi Namgay',
    cid_number: '11408001234',
    date_of_birth: '2008-08-10',
    gender: 'Male',
    dzongkhag: 'Pemagatshel',
    gewog: 'Norbugang',
    application_type: 'NEW' as const,
    approved_at: '2026-01-25T14:30:00Z',
    print_status: 'READY_TO_PRINT' as const
  },
  {
    id: '14',
    applicant_name: 'Pema Choki',
    cid_number: '11009002345',
    date_of_birth: '2000-09-18',
    gender: 'Female',
    dzongkhag: 'Lhuentse',
    gewog: 'Gangzur',
    application_type: 'RENEWAL' as const,
    approved_at: '2026-01-24T11:20:00Z',
    print_status: 'READY_TO_PRINT' as const
  },
  {
    id: '15',
    applicant_name: 'Jigme Dorji',
    cid_number: '10307003456',
    date_of_birth: '1993-07-25',
    gender: 'Male',
    dzongkhag: 'Samdrup Jongkhar',
    gewog: 'Dewathang',
    application_type: 'REPLACEMENT' as const,
    approved_at: '2026-01-23T16:45:00Z',
    print_status: 'PRINTED' as const
  },
  {
    id: '16',
    applicant_name: 'Sonam Lhamo',
    cid_number: '11201004567',
    date_of_birth: '2002-01-12',
    gender: 'Female',
    dzongkhag: 'Gasa',
    gewog: 'Khatoed',
    application_type: 'UPDATE' as const,
    approved_at: '2026-01-22T09:10:00Z',
    print_status: 'PRINTED' as const
  },
  {
    id: '17',
    applicant_name: 'Kinley Zangmo',
    cid_number: '11610005678',
    date_of_birth: '2008-10-05',
    gender: 'Female',
    dzongkhag: 'Thimphu',
    gewog: 'Mewang',
    application_type: 'NEW' as const,
    approved_at: '2026-01-21T13:00:00Z',
    print_status: 'COLLECTED' as const
  },
  {
    id: '18',
    applicant_name: 'Ugyen Namgay',
    cid_number: '10411006789',
    date_of_birth: '1994-11-20',
    gender: 'Male',
    dzongkhag: 'Trashiyangtse',
    gewog: 'Toetsho',
    application_type: 'RENEWAL' as const,
    approved_at: '2026-01-20T10:30:00Z',
    print_status: 'COLLECTED' as const
  }
];

export default function PrintPage() {
  return (
    <PageContainer
      pageTitle="Print CID Cards"
      pageDescription="Print approved CID cards and track printing status."
    >
      <div className="space-y-4">
        <DataTable
          columns={printColumns}
          data={printReadyData}
          totalItems={printReadyData.length}
        />
      </div>
    </PageContainer>
  );
}
