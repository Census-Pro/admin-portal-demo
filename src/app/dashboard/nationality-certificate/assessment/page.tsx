import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from '../_components/columns';
import { getSubmittedNationalityApplications } from '@/actions/issuance/nationality-application-actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';

export const metadata = {
  title: 'Dashboard: Nationality Certificate - Assessment'
};

export default async function NationalityCertificateAssessmentPage() {
  const result = await getSubmittedNationalityApplications();

  let applications = [];
  let errorMessage = '';

  if (result?.error) {
    errorMessage = result.message || 'Failed to load nationality applications';
  } else {
    applications = result.applications || [];
  }

  return (
    <PageContainer
      pageTitle="Nationality Certificate - Assessment"
      pageDescription="Review and assess submitted nationality certificate applications."
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
