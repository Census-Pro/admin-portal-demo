import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from '../_components/columns';

export const metadata = {
  title: 'Dashboard: CID Issuance - Verify'
};

// Dummy data for verification stage
const verificationData = [
  {
    id: '7',
    applicant_name: 'Dechen Zangmo',
    date_of_birth: '2008-04-12',
    gender: 'Female',
    dzongkhag: 'Samtse',
    gewog: 'Pemaling',
    application_type: 'NEW' as const,
    status: 'PENDING_VERIFICATION',
    created_at: '2026-02-05T10:30:00Z',
    phone_number: '17789012'
  },
  {
    id: '8',
    applicant_name: 'Tenzin Phuntsho',
    applicant_cid: '11304008901',
    date_of_birth: '2003-04-20',
    gender: 'Male',
    dzongkhag: 'Mongar',
    gewog: 'Kengkhar',
    application_type: 'RENEWAL' as const,
    status: 'PENDING_VERIFICATION',
    created_at: '2026-02-04T13:45:00Z',
    phone_number: '17890123',
    email: 'tenzin.phuntsho@bt.bt'
  },
  {
    id: '9',
    applicant_name: 'Namgay Dema',
    applicant_cid: '10906009012',
    date_of_birth: '1999-06-15',
    gender: 'Female',
    dzongkhag: 'Haa',
    gewog: 'Sama',
    application_type: 'UPDATE' as const,
    status: 'PENDING_VERIFICATION',
    created_at: '2026-02-03T09:20:00Z',
    phone_number: '17901234'
  }
];

export default function VerifyPage() {
  return (
    <PageContainer
      pageTitle="Verify CID Applications"
      pageDescription="Verify the authenticity and accuracy of CID application documents and information."
    >
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={verificationData}
          totalItems={verificationData.length}
        />
      </div>
    </PageContainer>
  );
}
