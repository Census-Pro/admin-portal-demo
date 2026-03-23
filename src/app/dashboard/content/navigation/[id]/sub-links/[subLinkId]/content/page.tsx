import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import {
  getSubLinks,
  getCmsPages,
  getNavigationItems
} from '@/actions/common/cms-actions';
import PageContainer from '@/components/layout/page-container';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentPagesTable } from './_components/content-pages-table';
import { AddContentPageButton } from './_components/add-content-page-button';

interface ContentPagesPageProps {
  params: Promise<{
    id: string;
    subLinkId: string;
  }>;
}

async function ContentPagesContent({
  navigationId,
  subLinkId
}: {
  navigationId: string;
  subLinkId: string;
}) {
  // Fetch sub-link details
  const subLinksResult = await getSubLinks();
  const subLink = subLinksResult.success
    ? subLinksResult.data.find((link: any) => link.id === subLinkId)
    : null;

  if (!subLink) {
    notFound();
  }

  // Fetch the parent nav item label for the breadcrumb
  const navResult = await getNavigationItems();
  const navItem = navResult.success
    ? navResult.data.find((nav: any) => nav.id === navigationId)
    : null;

  // Fetch content pages for this sub-link
  const pagesResult = await getCmsPages();
  const contentPages = pagesResult.success
    ? pagesResult.data
        .filter((page: any) => page.cm_sub_link_id === subLinkId)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    : [];

  return (
    <>
      {/* ── Breadcrumb trail ── */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-1.5 text-sm"
      >
        <a
          href="/dashboard/content"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Content
        </a>
        <span className="text-muted-foreground">/</span>
        <a
          href="/dashboard/content/navigation"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Navigation
        </a>
        <span className="text-muted-foreground">/</span>
        <a
          href={`/dashboard/content/navigation/${navigationId}/sub-links`}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {navItem?.label ?? 'Sub-Links'}
        </a>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">{subLink.label}</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">Content</span>
      </nav>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Content Pages for "{subLink.label}"
          </h2>
          <p className="text-muted-foreground mt-1">
            {contentPages.length} {contentPages.length === 1 ? 'page' : 'pages'}{' '}
            in this sub-link
          </p>
        </div>
        <AddContentPageButton
          navigationId={navigationId}
          subLinkId={subLinkId}
        />
      </div>

      <ContentPagesTable data={contentPages} subLink={subLink} />
    </>
  );
}

export default async function ContentPagesPage({
  params
}: ContentPagesPageProps) {
  const { id, subLinkId } = await params;

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
        <ContentPagesContent navigationId={id} subLinkId={subLinkId} />
      </Suspense>
    </PageContainer>
  );
}
