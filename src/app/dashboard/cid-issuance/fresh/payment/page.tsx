import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from '../../_components/columns';
import { getAssessedApplicationsByPaymentType } from '@/actions/issuance/cid-issuance-actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';

export const metadata = {
  title: 'Dashboard: Fresh CID - Payment'
};

export default async function FreshPaymentPage() {
  const applicationsResult =
    await getAssessedApplicationsByPaymentType('FRESH');

  let applications = [];
  let errorMessage = '';

  if (applicationsResult.error) {
    errorMessage = applicationsResult.message || 'Failed to load applications';
  } else {
    applications = applicationsResult.applications || [];
  }

  return (
    <PageContainer
      pageTitle="Fresh CID - Payment Verification"
      pageDescription="Verify and process payments for new CID applications."
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
