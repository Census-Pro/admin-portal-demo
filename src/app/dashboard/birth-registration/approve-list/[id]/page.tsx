import PageContainer from '@/components/layout/page-container';
import { BirthRegistrationApproveListView } from '../_components/birth-registration-approve-list-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { getBirthApplicationById } from '@/actions/common/birth-registration-actions';

export const metadata = {
  title: 'Birth Registration - Approved Details'
};

interface ApproveListDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ApproveListDetailPage({
  params
}: ApproveListDetailPageProps) {
  const { id } = await params;

  const result = await getBirthApplicationById(id);

  const backButton = (
    <Link href="/dashboard/birth-registration/approve-list">
      <Button variant="outline">
        <IconArrowLeft className="mr-2 h-4 w-4" />
        Back to Approved List
      </Button>
    </Link>
  );

  if (!result.success || !result.data) {
    return (
      <PageContainer
        pageTitle="Birth Registration - Approved Details"
        pageDescription="Unable to load application"
        pageHeaderAction={backButton}
      >
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-gray-500">
          <p className="font-medium">Failed to load birth application</p>
          <p className="text-xs text-gray-400">{result.error}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      pageTitle="Birth Registration - Approved Details"
      pageDescription={`Viewing approved birth registration application #${id}`}
      pageHeaderAction={backButton}
    >
      <BirthRegistrationApproveListView data={result.data} applicationId={id} />
    </PageContainer>
  );
}
