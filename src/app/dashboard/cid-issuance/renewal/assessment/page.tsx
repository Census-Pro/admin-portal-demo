import PageContainer from '@/components/layout/page-container';
import { CidRenewalAssessmentTable } from './_components/assessment-table';

export const metadata = {
  title: 'Dashboard: CID Renewal - Assessment'
};

export default function RenewalAssessmentPage() {
  return (
    <PageContainer
      pageTitle="CID Renewal - Assessment"
      pageDescription="Assess CID renewal applications for eligibility and document verification."
    >
      <CidRenewalAssessmentTable />
    </PageContainer>
  );
}
