import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { MoveInOutApproveView } from '../_components/move-in-out-approve-view';

export const metadata = {
  title: 'Move In/Out - Receiving - Approve Application'
};

export default async function MoveInOutReceivingApproveDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer
      pageTitle="Move In/Out - Receiving - Approve Application"
      pageDescription="Review and approve move-in-out application details"
      pageHeaderAction={
        <Link href="/dashboard/move-in-out/receiving/approve">
          <Button variant="outline" size="sm">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </Link>
      }
    >
      <MoveInOutApproveView applicationId={id} />
    </PageContainer>
  );
}
