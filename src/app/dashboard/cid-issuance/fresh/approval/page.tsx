import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from '../../_components/columns';
import { getAllPaymentServiceTypes } from '@/actions/common/payment-service-type-actions';
import { getCIDApplicationsByPaymentType } from '@/actions/issuance/cid-issuance-actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';
import { DUMMY_CID_APPLICATION } from '../../_dummy-data';

export const metadata = {
  title: 'Dashboard: Fresh CID - Approval'
};

export default async function FreshApprovalPage() {
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
      const paymentType = (type.payment_type || type.name || '').toLowerCase();
      return (
        paymentType.includes('new') ||
        paymentType.includes('fresh') ||
        paymentType === 'cid new'
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
        // TODO: Filter by approval status if needed
        // applications = applications.filter(app => app.status === 'PENDING_APPROVAL' || app.status === 'APPROVED');
      }
    } else {
      errorMessage =
        'Payment service type for Fresh CID not found. Please configure payment service types first.';
    }
  }

  return (
    <PageContainer
      pageTitle="Fresh CID - Final Approval"
      pageDescription="Final approval of new CID applications before card production."
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
          data={[DUMMY_CID_APPLICATION, ...applications]}
          totalItems={applications.length + 1}
        />
      </div>
    </PageContainer>
  );
}
