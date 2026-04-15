import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { RelationshipApplicationView } from '../_components/relationship-application-view';

export const metadata = {
  title: 'Relationship Certificate Application Details'
};

export default async function RelationshipApplicationDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer
      pageTitle="Relationship Certificate Application Details"
      pageDescription="Review relationship certificate application details"
      pageHeaderAction={
        <Link href="/dashboard/relation-certificate/assessment">
          <Button variant="outline" size="sm">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Assessment List
          </Button>
        </Link>
      }
    >
      <RelationshipApplicationView applicationId={id} />
    </PageContainer>
  );
}
