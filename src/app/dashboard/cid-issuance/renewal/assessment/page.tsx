import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { assessmentColumns } from '../../_components/assessment-columns';
import { getSubmittedApplicationsByPaymentType } from '@/actions/issuance/cid-issuance-actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';
import { DUMMY_CID_APPLICATION } from '../../_dummy-data';

export const metadata = {
  title: 'Dashboard: CID Renewal - Assessment'
};

export default async function RenewalAssessmentPage() {
  let applications = [];
  let errorMessage = '';

  // Fetch SUBMITTED applications for RENEWAL payment type
  const applicationsResult =
    await getSubmittedApplicationsByPaymentType('RENEWAL');

  if (applicationsResult.error) {
    errorMessage =
      applicationsResult.message || 'Failed to load SUBMITTED applications';
  } else {
    applications = applicationsResult.applications || [];
  }

  return (
    <PageContainer
      pageTitle="CID Renewal - Assessment"
      pageDescription="Assess CID renewal applications for eligibility and document verification."
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
          data={[DUMMY_CID_APPLICATION, ...applications]}
          totalItems={applications.length + 1}
        />
      </div>
    </PageContainer>
  );
}
