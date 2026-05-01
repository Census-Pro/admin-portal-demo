import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns, NationalityApplication } from '../_components/columns';

export const metadata = {
  title: 'Dashboard: Nationality Certificate - Assessment'
};

const dummyApplications: NationalityApplication[] = [
  {
    id: '1',
    created_at: '2026-04-10T08:30:00Z',
    updated_at: '2026-04-10T08:30:00Z',
    application_no: 'NC-2026-00001',
    applicant_cid_no: '11801000123',
    applicant_contact_no: '17654321',
    applicant_is: 'SELF',
    minor_cid: '11815000101',
    minor_name: 'Pema Dorji',
    dob: null,
    parent_approval: 'PENDING',
    application_status: 'SUBMITTED'
  },
  {
    id: '2',
    created_at: '2026-04-12T10:15:00Z',
    updated_at: '2026-04-12T10:15:00Z',
    application_no: 'NC-2026-00002',
    applicant_cid_no: '11801000456',
    applicant_contact_no: '17123456',
    applicant_is: 'PARENT',
    minor_cid: '11815000789',
    minor_name: 'Tenzin Wangchuk',
    dob: '2015-06-20',
    parent_approval: 'PENDING',
    application_status: 'SUBMITTED'
  },
  {
    id: '3',
    created_at: '2026-04-18T14:00:00Z',
    updated_at: '2026-04-18T14:00:00Z',
    application_no: 'NC-2026-00003',
    applicant_cid_no: '11801000789',
    applicant_contact_no: '17987654',
    applicant_is: 'SELF',
    minor_cid: '11815000303',
    minor_name: 'Sonam Choden',
    dob: null,
    parent_approval: 'PENDING',
    application_status: 'SUBMITTED'
  }
];

export default function NationalityCertificateAssessmentPage() {
  return (
    <PageContainer
      pageTitle="Nationality Certificate - Assessment"
      pageDescription="Review and assess submitted nationality certificate applications."
    >
      <DataTable
        columns={columns}
        data={dummyApplications}
        totalItems={dummyApplications.length}
      />
    </PageContainer>
  );
}
