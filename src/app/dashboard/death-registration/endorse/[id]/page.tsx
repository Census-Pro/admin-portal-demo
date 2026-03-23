import PageContainer from '@/components/layout/page-container';
import { DeathRegistrationEndorseView } from '../_components/death-registration-endorse-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

export const metadata = {
  title: 'Death Registration - Endorse Details'
};

interface EndorseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EndorseDetailPage({
  params
}: EndorseDetailPageProps) {
  const { id } = await params;

  return (
    <PageContainer
      pageTitle="Death Registration - Endorse Details"
      pageDescription={`Reviewing death registration application #${id}`}
      pageHeaderAction={
        <Link href="/dashboard/death-registration/endorse">
          <Button variant="outline">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Endorsement List
          </Button>
        </Link>
      }
    >
      <DeathRegistrationEndorseView applicationId={id} />
    </PageContainer>
  );
}
