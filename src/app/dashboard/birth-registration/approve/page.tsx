import PageContainer from '@/components/layout/page-container';
import { ApprovePageClient } from './_components/approve-page-client';

export const metadata = {
  title: 'Birth Registration - Approve'
};

export default function BirthRegistrationApprovePage() {
  return (
    <PageContainer
      pageTitle="Birth Registration - Approve"
      pageDescription="Review and approve verified birth registration applications"
    >
      <ApprovePageClient />
    </PageContainer>
  );
}
