import PageContainer from '@/components/layout/page-container';
import { BirthRegistrationVerifyView } from '../_components/birth-registration-verify-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { getBirthApplicationById } from '@/actions/common/birth-registration-actions';

export const metadata = {
  title: 'Birth Registration - Verify Details'
};

interface VerifyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VerifyDetailPage({
  params
}: VerifyDetailPageProps) {
  const { id } = await params;

  const result = await getBirthApplicationById(id);

  const backButton = (
    <Link href="/dashboard/birth-registration/verify">
      <Button variant="outline">
        <IconArrowLeft className="mr-2 h-4 w-4" />
        Back to Verification List
      </Button>
    </Link>
  );

  if (!result.success || !result.data) {
    return (
      <PageContainer
        pageTitle="Birth Registration - Verify Details"
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
      pageTitle="Birth Registration - Verify Details"
      pageDescription={`Reviewing birth registration application #${id}`}
      pageHeaderAction={backButton}
    >
      <BirthRegistrationVerifyView data={result.data} applicationId={id} />
    </PageContainer>
  );
}
