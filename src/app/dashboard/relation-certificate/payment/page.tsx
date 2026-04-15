import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { getAssessedPendingPaymentApplications } from '@/actions/issuance/relationship-application-actions';
import { paymentColumns } from './_components/payment-columns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';

export const metadata = {
  title: 'Dashboard: Relation Certificate - Payment'
};

export default async function RelationCertificatePaymentPage() {
  const result = await getAssessedPendingPaymentApplications();

  let applications = [];
  let errorMessage = '';

  if (result?.error) {
    errorMessage = result.message || 'Failed to load assessed applications';
  } else {
    applications = result.applications || [];
  }

  return (
    <PageContainer
      pageTitle="Relation Certificate - Payment"
      pageDescription="Assessed applications with pending payment."
    >
      <div className="space-y-4">
        {errorMessage && (
          <Alert>
            <IconInfoCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <DataTable
          columns={paymentColumns}
          data={applications}
          totalItems={applications.length}
        />
      </div>
    </PageContainer>
  );
}
