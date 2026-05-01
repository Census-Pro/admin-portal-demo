import PageContainer from '@/components/layout/page-container';
import { RelievingPageClient } from './_components/relieving-page-client';

export const metadata = {
  title: 'Move In/Out - Relieving'
};

export default function MoveInOutRelievingPage() {
  return (
    <PageContainer
      pageTitle="Move In/Out - Relieving"
      pageDescription="Review and manage move-in-out applications submitted for relieving"
    >
      <RelievingPageClient />
    </PageContainer>
  );
}
