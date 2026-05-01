import PageContainer from '@/components/layout/page-container';
import { CidReplacementAssessmentTable } from './_components/assessment-table';

export const metadata = {
  title: 'Dashboard: CID Replacement - Assessment'
};

export default function ReplacementAssessmentPage() {
  return (
    <PageContainer
      pageTitle="CID Replacement - Assessment"
      pageDescription="Assess CID replacement applications for eligibility and document verification."
    >
      <CidReplacementAssessmentTable />
    </PageContainer>
  );
}
