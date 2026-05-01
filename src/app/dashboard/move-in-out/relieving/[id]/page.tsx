import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { MoveInOutView } from '../../_components/move-in-out-view';

export const metadata = {
  title: 'Move In/Out Application Details'
};

export default async function MoveInOutDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer
      pageTitle="Move In/Out Application Details"
      pageDescription="Review move-in-out application details"
      pageHeaderAction={
        <Link href="/dashboard/move-in-out/relieving">
          <Button variant="outline" size="sm">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </Link>
      }
    >
      <MoveInOutView applicationId={id} mode="verify" />
    </PageContainer>
  );
}
