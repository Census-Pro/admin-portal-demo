import PageContainer from '@/components/layout/page-container';
import { AssessmentTable } from './_components/assessment-table';

export const metadata = {
  title: 'Dashboard: Relation Certificate - Assessment'
};

export default function RelationCertificateAssessmentPage() {
  return (
    <PageContainer
      pageTitle="Relation Certificate - Assessment"
      pageDescription="Review and assess submitted relationship certificate applications."
    >
      <AssessmentTable />
    </PageContainer>
  );
}
