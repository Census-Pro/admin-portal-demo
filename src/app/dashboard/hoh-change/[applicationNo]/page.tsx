import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { HohChangeView } from '../_components/hoh-change-view';

export const metadata = {
  title: 'HOH Change Application Details'
};

export default async function HohChangeDetailPage({
  params
}: {
  params: Promise<{ applicationNo: string }>;
}) {
  const { applicationNo } = await params;
  console.log('Page received applicationNo:', applicationNo);

  return (
    <PageContainer
      pageTitle="HOH Change Application Details"
      pageDescription="Review head of household change application details"
      pageHeaderAction={
        <Link href="/dashboard/hoh-change">
          <Button variant="outline" size="sm">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to HOH Change List
          </Button>
        </Link>
      }
    >
      <HohChangeView applicationId={applicationNo} />
    </PageContainer>
  );
}
