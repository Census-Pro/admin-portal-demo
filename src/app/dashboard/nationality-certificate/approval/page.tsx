import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { getAssessedPaidPaymentNationalityApplications } from '@/actions/issuance/nationality-application-actions';
import { approvalColumns } from './_components/approval-columns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';

export const metadata = {
  title: 'Dashboard: Nationality Certificate - Approval'
};

const DUMMY_APPLICATIONS = [
  {
    id: 'dummy-1',
    application_no: 'NC-2026-00001',
    applicant_cid_no: '11607000001',
    applicant_contact_no: '17654321',
    applicant_is: 'PARENT',
    minor_cid: '11607000099',
    minor_name: 'Tshering Dorji',
    dob: '2015-05-20',
    parent_approval: 'APPROVED',
    application_status: 'ASSESSED',
    created_at: '2026-04-10T08:00:00.000Z',
    createdAt: '2026-04-10T08:00:00.000Z',
    updatedAt: '2026-04-15T10:00:00.000Z',
    fee: {
      id: 'fee-1',
      application_no: 'NC-2026-00001',
      amount: 500,
      status: 'PAID',
      transaction_no: 'TXN-20260410-001',
      contact_no: '17654321',
      payment_service_type_id: 'svc-1'
    }
  }
];

export default async function NationalityCertificateApprovalPage() {
  const result = await getAssessedPaidPaymentNationalityApplications();

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
      pageTitle="Nationality Certificate - Approval"
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
