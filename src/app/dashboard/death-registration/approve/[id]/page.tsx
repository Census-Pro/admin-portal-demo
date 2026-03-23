import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { DeathRegistrationApproveView } from '../_components/death-registration-approve-view';

export const metadata = {
  title: 'Approve Death Registration'
};

export default async function DeathRegistrationApproveDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer
      pageTitle="Approve Death Registration"
      pageDescription="Review and approve the death registration"
      pageHeaderAction={
        <Link href="/dashboard/death-registration/approve">
          <Button variant="outline" size="sm">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Approval List
          </Button>
        </Link>
      }
    >
      <DeathRegistrationApproveView applicationId={id} />
    </PageContainer>
  );
}
