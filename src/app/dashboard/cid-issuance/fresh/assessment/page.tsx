import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { assessmentColumns } from '../../_components/assessment-columns';
import { getSubmittedApplicationsByPaymentType } from '@/actions/issuance/cid-issuance-actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';

export const metadata = {
  title: 'Dashboard: Fresh CID - Assessment'
};

export default async function FreshAssessmentPage() {
  let applications = [];
  let errorMessage = '';

  // Fetch SUBMITTED applications for FRESH payment type
  const applicationsResult =
    await getSubmittedApplicationsByPaymentType('FRESH');

  if (applicationsResult.error) {
    errorMessage =
      applicationsResult.message || 'Failed to load SUBMITTED applications';
  } else {
    applications = applicationsResult.applications || [];
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
          columns={assessmentColumns}
          data={applications}
          totalItems={applications.length}
        />
      </div>
    </PageContainer>
  );
}
