import PageContainer from '@/components/layout/page-container';
import { AssessmentTable } from './_components/assessment-table';
import { AssessmentSearchBar } from './_components/search-bar';

export const metadata = {
  title: 'Dashboard: Relation Certificate - Assessment'
};

export default function RelationCertificateAssessmentPage() {
  return (
    <PageContainer
      pageTitle="Relation Certificate - Assessment"
      pageDescription="Review and assess submitted relationship certificate applications."
    >
      <div className="space-y-4">
        <AssessmentSearchBar />
        <AssessmentTable />
      </div>
    </PageContainer>
  );
}
