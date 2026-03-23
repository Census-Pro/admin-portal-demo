import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { DeathRegistrationVerifyView } from '../_components/death-registration-verify-view';

export const metadata = {
  title: 'Verify Death Registration'
};

export default async function DeathRegistrationVerifyDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer
      pageTitle="Verify Death Registration"
      pageDescription="Review and verify the death registration details"
      pageHeaderAction={
        <Link href="/dashboard/death-registration/verify">
          <Button variant="outline" size="sm">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Verification List
          </Button>
        </Link>
      }
    >
      <DeathRegistrationVerifyView applicationId={id} />
    </PageContainer>
  );
}
