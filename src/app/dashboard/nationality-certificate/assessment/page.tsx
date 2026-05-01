import PageContainer from '@/components/layout/page-container';
import { NcAssessmentTable } from './_components/assessment-table';

export const metadata = {
  title: 'Dashboard: Nationality Certificate - Assessment'
};

export default function NationalityCertificateAssessmentPage() {
  return (
    <PageContainer
      pageTitle="Nationality Certificate - Assessment"
      pageDescription="Review and assess submitted nationality certificate applications."
    >
      <NcAssessmentTable />
    </PageContainer>
  );
}
