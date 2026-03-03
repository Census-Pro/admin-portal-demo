import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { getCmsPages } from '@/actions/common/cms-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddPageButton } from './_components/add-page-button';
import { PagesTable } from './_components/pages-table';

export const metadata = {
  title: 'Dashboard: Content Pages'
};

export default async function ContentPage() {
  return (
    <PageContainer
      pageTitle="Content Pages"
      pageDescription="Manage content pages for the portal."
      pageHeaderAction={<AddPageButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
        >
          <PagesDataWrapper />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function PagesDataWrapper() {
  const result = await getCmsPages();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const pages = result.data || [];

  return <PagesTable data={pages} />;
}
