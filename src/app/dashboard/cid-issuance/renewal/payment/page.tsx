import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from '../../_components/columns';
import { getAllPaymentServiceTypes } from '@/actions/common/payment-service-type-actions';
import { getCIDApplicationsByPaymentType } from '@/actions/issuance/cid-issuance-actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';

export const metadata = {
  title: 'Dashboard: CID Renewal - Payment'
};

export default async function RenewalPaymentPage() {
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

    const renewalPaymentType = paymentTypes.find((type: any) => {
      const name = type.name?.toLowerCase() || '';
      return (
        name.includes('renew') || name === 'cid renewal' || name === 'cid renew'
      );
    });

    if (renewalPaymentType) {
      const applicationsResult = await getCIDApplicationsByPaymentType(
        renewalPaymentType.id
      );

      if (applicationsResult.error) {
        errorMessage =
          applicationsResult.message || 'Failed to load applications';
      } else {
        applications = applicationsResult.applications || [];
      }
    } else {
      errorMessage =
        'Payment service type for CID Renewal not found. Please configure payment service types first.';
    }
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
