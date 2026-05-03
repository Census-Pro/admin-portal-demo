import PageContainer from '@/components/layout/page-container';
import { NcAssessmentTable } from './_components/assessment-table';
import { AssessmentSearchBar } from './_components/search-bar';

export const metadata = {
  title: 'Dashboard: Nationality Certificate - Assessment'
};

export default function NationalityCertificateAssessmentPage() {
  return (
    <PageContainer
      pageTitle="Nationality Certificate - Assessment"
      pageDescription="Review and assess submitted nationality certificate applications."
    >
      <div className="space-y-4">
        <AssessmentSearchBar />
        <NcAssessmentTable />
      </div>
    </PageContainer>
  );
}
