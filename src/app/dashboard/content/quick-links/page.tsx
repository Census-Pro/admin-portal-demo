import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { getQuickLinks } from '@/actions/common/cms-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddQuickLinkButton } from './_components/add-link-button';
import { QuickLinksTable } from './_components/quick-links-table';

export const metadata = {
  title: 'Dashboard: Quick Links'
};

export default async function QuickLinksPage() {
  return (
    <PageContainer
      pageTitle="Quick Links"
      pageDescription="Manage sidebar links, downloads, and external resources"
      pageHeaderAction={<AddQuickLinkButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={6} rowCount={10} />}
        >
          <QuickLinksDataWrapper />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function QuickLinksDataWrapper() {
  const result = await getQuickLinks();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const links = result.data || [];

  return <QuickLinksTable data={links} />;
}
