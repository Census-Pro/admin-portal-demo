import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from '../_components/columns';
import { getSubmittedRelationshipApplications } from '@/actions/issuance/relationship-application-actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';

export const metadata = {
  title: 'Dashboard: Relation Certificate - Assessment'
};

export default async function RelationCertificateAssessmentPage() {
  const result = await getSubmittedRelationshipApplications();

  let applications = [];
  let errorMessage = '';

  if (result?.error) {
    errorMessage = result.message || 'Failed to load relationship applications';
  } else {
    applications = result.applications || [];
  }

  return (
    <PageContainer
      pageTitle="Relation Certificate - Assessment"
      pageDescription="Review and assess submitted relationship certificate applications."
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
