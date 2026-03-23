import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import {
  getNavigationItems,
  getSubLinksByNavigation
} from '@/actions/common/cms-actions';
import PageContainer from '@/components/layout/page-container';
import { SubLinksTable } from './_components/sub-links-table';
import { AddSubLinkButton } from './_components/add-sub-link-button';
import { Skeleton } from '@/components/ui/skeleton';

interface SubLinksPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function SubLinksContent({ navigationId }: { navigationId: string }) {
  // Fetch navigation item
  const navResult = await getNavigationItems();
  const navigationItem = navResult.success
    ? navResult.data.find((nav: any) => nav.id === navigationId)
    : null;

  if (!navigationItem) {
    notFound();
  }

  // Fetch sub-links for this navigation
  const subLinksResult = await getSubLinksByNavigation(navigationId);
  const subLinks = subLinksResult.success ? subLinksResult.data : [];

  return (
    <>
      {/* Breadcrumb removed to avoid double breadcrumbs */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Sub-Links for "{navigationItem.label}"
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage categories and groups under this navigation item. Each
            sub-link can hold multiple content pages.
          </p>
        </div>
        <AddSubLinkButton navigationId={navigationId} />
      </div>

      <SubLinksTable data={subLinks} navigationItem={navigationItem} />
    </>
  );
}

export default async function SubLinksPage({ params }: SubLinksPageProps) {
  const { id } = await params;

  return (
    <PageContainer>
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <SubLinksContent navigationId={id} />
      </Suspense>
    </PageContainer>
  );
}
