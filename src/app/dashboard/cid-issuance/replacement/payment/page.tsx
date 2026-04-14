import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from '../../_components/columns';
import { getAllPaymentServiceTypes } from '@/actions/common/payment-service-type-actions';
import { getCIDApplicationsByPaymentType } from '@/actions/issuance/cid-issuance-actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';

export const metadata = {
  title: 'Dashboard: CID Replacement - Payment'
};

export default async function ReplacementPaymentPage() {
  const paymentTypesResult = await getAllPaymentServiceTypes();

  let applications = [];
  let errorMessage = '';

  if (paymentTypesResult?.error) {
    errorMessage =
      paymentTypesResult.message || 'Failed to load payment service types';
  } else {
    const paymentTypes = Array.isArray(paymentTypesResult)
      ? paymentTypesResult
      : paymentTypesResult?.data || [];

    const replacementPaymentType = paymentTypes.find((type: any) => {
      const name = type.name?.toLowerCase() || '';
      return name.includes('replace') || name === 'cid replacement';
    });

    if (replacementPaymentType) {
      const applicationsResult = await getCIDApplicationsByPaymentType(
        replacementPaymentType.id
      );

      if (applicationsResult.error) {
        errorMessage =
          applicationsResult.message || 'Failed to load applications';
      } else {
        applications = applicationsResult.applications || [];
      }
    } else {
      errorMessage =
        'Payment service type for CID Replacement not found. Please configure payment service types first.';
    }
  }

  return (
    <PageContainer
      pageTitle="CID Replacement - Payment Verification"
      pageDescription="Verify and process payments for CID replacement applications."
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
