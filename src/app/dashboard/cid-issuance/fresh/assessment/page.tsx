import PageContainer from '@/components/layout/page-container';
import { CidAssessmentTable } from './_components/assessment-table';

export const metadata = {
  title: 'Dashboard: Fresh CID - Assessment'
};

export default function FreshAssessmentPage() {
  return (
    <PageContainer
      pageTitle="Fresh CID - Assessment"
      pageDescription="Assess new CID applications for eligibility and document verification."
    >
      <CidAssessmentTable />
    </PageContainer>
  );
}
