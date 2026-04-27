import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from '../../_components/columns';
import { getAssessedApplicationsByPaymentType } from '@/actions/issuance/cid-issuance-actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';

export const metadata = {
  title: 'Dashboard: CID Renewal - Payment'
};

export default async function RenewalPaymentPage() {
  const applicationsResult =
    await getAssessedApplicationsByPaymentType('RENEWAL');

  let applications = [];
  let errorMessage = '';

  if (applicationsResult.error) {
    errorMessage = applicationsResult.message || 'Failed to load applications';
  } else {
    applications = applicationsResult.applications || [];
  }

  return (
    <PageContainer
      pageTitle="CID Renewal - Payment Verification"
      pageDescription="Verify and process payments for CID renewal applications."
    >
      <div className="space-y-4">
        {errorMessage && (
          <Alert>
            <IconInfoCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <DataTable
          columns={columns}
          data={applications}
          totalItems={applications.length}
        />
      </div>
    </PageContainer>
  );
}
