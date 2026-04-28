import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { getAssessedPaidPaymentApplications } from '@/actions/issuance/relationship-application-actions';
import { approvalColumns } from './_components/approval-columns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';

export const metadata = {
  title: 'Dashboard: Relation Certificate - Approval'
};

const DUMMY_APPLICATIONS = [
  {
    id: 'dummy-1',
    application_no: 'RC-2026-00001',
    applicant_cid: '11607000001',
    applicant_name: 'Karma Wangchuk',
    applicant_contact_no: '17654321',
    relationship_to_cid: '11607000002',
    relationship_to_name: 'Tshering Wangchuk',
    purpose_id: 'purpose-1',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'ASSESSED',
    createdAt: '2026-04-10T08:00:00.000Z',
    updatedAt: '2026-04-15T10:00:00.000Z',
    purpose: {
      id: 'purpose-1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Brother'
    },
    fee: {
      id: 'fee-1',
      application_no: 'RC-2026-00001',
      amount: 300,
      status: 'PAID',
      transaction_no: 'TXN-20260410-001',
      contact_no: '17654321',
      payment_service_type_id: 'svc-1'
    }
  }
];

export default async function RelationCertificateApprovalPage() {
  const result = await getAssessedPaidPaymentApplications();

  let applications = [];
  let errorMessage = '';

  if (result?.error) {
    errorMessage = result.message || 'Failed to load applications';
    applications = DUMMY_APPLICATIONS;
  } else {
    applications =
      result.applications?.length > 0
        ? result.applications
        : DUMMY_APPLICATIONS;
  }

  return (
    <PageContainer
      pageTitle="Relation Certificate - Approval"
      pageDescription="Assessed applications with paid payment pending approval."
    >
      <div className="space-y-4">
        {errorMessage && (
          <Alert>
            <IconInfoCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <DataTable
          columns={approvalColumns}
          data={applications}
          totalItems={applications.length}
        />
      </div>
    </PageContainer>
  );
}
