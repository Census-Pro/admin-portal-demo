import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  getQuickLinks,
  getQuickLinkCategories
} from '@/actions/common/cms-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { QuickLinksTable } from './_components/quick-links-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriesTable } from '../quick-link-categories/_components/categories-table';
import { AddQuickLinkButton } from './_components/add-link-button';
import { AddCategoryButton } from '../quick-link-categories/_components/add-category-button';

export const metadata = {
  title: 'Dashboard: Quick Links'
};

export default async function QuickLinksPage({
  searchParams
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const { tab } = await searchParams;
  const defaultTab = tab === 'categories' ? 'categories' : 'links';
  return (
    <PageContainer
      pageTitle="Quick Links"
      pageDescription="Manage sidebar links, downloads, and external resources — and their categories."
    >
      <Tabs defaultValue={defaultTab} className="space-y-2">
        <TabsList>
          <TabsTrigger value="links">Quick Links</TabsTrigger>
          <TabsTrigger value="categories">Link Categories</TabsTrigger>
        </TabsList>

        {/* ── Quick Links tab ── */}
        <TabsContent value="links" className="space-y-2">
          <Suspense
            fallback={<DataTableSkeleton columnCount={6} rowCount={10} />}
          >
            <QuickLinksDataWrapper addButton={<AddQuickLinkButton />} />
          </Suspense>
        </TabsContent>

        {/* ── Categories tab ── */}
        <TabsContent value="categories" className="space-y-2">
          <Suspense
            fallback={<DataTableSkeleton columnCount={6} rowCount={6} />}
          >
            <QLCategoriesDataWrapper addButton={<AddCategoryButton />} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

async function QuickLinksDataWrapper({
  addButton
}: {
  addButton?: React.ReactNode;
}) {
  const result = await getQuickLinks();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const links = result.data || [];
  return <QuickLinksTable data={links} addButton={addButton} />;
}

async function QLCategoriesDataWrapper({
  addButton
}: {
  addButton?: React.ReactNode;
}) {
  const result = await getQuickLinkCategories();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const categories = result.data || [];
  return <CategoriesTable data={categories} addButton={addButton} />;
}
