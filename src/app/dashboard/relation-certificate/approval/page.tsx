import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { getAssessedPaidPaymentApplications } from '@/actions/issuance/relationship-application-actions';
import { approvalColumns } from './_components/approval-columns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';

export const metadata = {
  title: 'Dashboard: Relation Certificate - Approval'
};

export default async function RelationCertificateApprovalPage() {
  const result = await getAssessedPaidPaymentApplications();

  let applications = [];
  let errorMessage = '';

  if (result?.error) {
    errorMessage = result.message || 'Failed to load applications';
  } else {
    applications = result.applications || [];
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
