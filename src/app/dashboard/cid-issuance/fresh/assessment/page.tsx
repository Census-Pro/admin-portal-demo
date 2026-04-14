import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from '../../_components/columns';
import { getAllPaymentServiceTypes } from '@/actions/common/payment-service-type-actions';
import { getCIDApplicationsByPaymentType } from '@/actions/issuance/cid-issuance-actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';

export const metadata = {
  title: 'Dashboard: Fresh CID - Assessment'
};

export default async function FreshAssessmentPage() {
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

    const freshPaymentType = paymentTypes.find((type: any) => {
      const name = type.name?.toLowerCase() || '';
      return (
        name.includes('new') || name.includes('fresh') || name === 'cid new'
      );
    });

    if (freshPaymentType) {
      const applicationsResult = await getCIDApplicationsByPaymentType(
        freshPaymentType.id
      );

      if (applicationsResult.error) {
        errorMessage =
          applicationsResult.message || 'Failed to load applications';
      } else {
        applications = applicationsResult.applications || [];
        // TODO: Filter by assessment status if needed
        // applications = applications.filter(app => app.status === 'PENDING_ASSESSMENT');
      }
    } else {
      errorMessage =
        'Payment service type for Fresh CID not found. Please configure payment service types first.';
    }
  }

  return (
    <PageContainer
      pageTitle="Fresh CID - Assessment"
      pageDescription="Assess new CID applications for eligibility and document verification."
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
