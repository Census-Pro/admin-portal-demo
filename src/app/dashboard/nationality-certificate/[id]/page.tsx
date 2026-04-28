import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { NationalityApplicationView } from '../_components/nationality-application-view';

export const metadata = {
  title: 'Nationality Certificate Application Details'
};

export default async function NationalityApplicationDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;

  const getBackButtonInfo = () => {
    switch (from) {
      case 'payment':
        return {
          href: '/dashboard/nationality-certificate/payment',
          text: 'Back to Payment List'
        };
      case 'approval':
        return {
          href: '/dashboard/nationality-certificate/approval',
          text: 'Back to Approval List'
        };
      default:
        return {
          href: '/dashboard/nationality-certificate/assessment',
          text: 'Back to Assessment List'
        };
    }
  };

  const backInfo = getBackButtonInfo();

  return (
    <PageContainer
      pageTitle="Nationality Certificate Application Details"
      pageDescription="Review nationality certificate application details"
      pageHeaderAction={
        <Link href={backInfo.href}>
          <Button variant="outline" size="sm">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            {backInfo.text}
          </Button>
        </Link>
      }
    >
      <NationalityApplicationView applicationId={id} from={from} />
    </PageContainer>
  );
}
