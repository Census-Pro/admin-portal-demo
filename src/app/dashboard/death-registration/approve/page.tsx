import PageContainer from '@/components/layout/page-container';
import { ApprovePageClient } from './_components/approve-page-client';

export const metadata = {
  title: 'Death Registration - Approve'
};

export default function DeathRegistrationApprovePage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Approve"
      pageDescription="Review and approve unassigned death registration applications"
    >
      <ApprovePageClient />
    </PageContainer>
  );
}
