import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { MoveInOutEndorseView } from '../_components/move-in-out-endorse-view';

export const metadata = {
  title: 'Move In/Out - Receiving - Endorse Application'
};

export default async function MoveInOutReceivingEndorseDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer
      pageTitle="Move In/Out - Receiving - Endorse Application"
      pageDescription="Review and endorse move-in-out application details"
      pageHeaderAction={
        <Link href="/dashboard/move-in-out/receiving/endorse">
          <Button variant="outline" size="sm">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </Link>
      }
    >
      <MoveInOutEndorseView applicationId={id} />
    </PageContainer>
  );
}
