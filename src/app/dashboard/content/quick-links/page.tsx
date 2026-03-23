import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  getQuickLinks,
  getQuickLinkCategories
} from '@/actions/common/cms-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddQuickLinkButton } from './_components/add-link-button';
import { QuickLinksTable } from './_components/quick-links-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddCategoryButton } from '../quick-link-categories/_components/add-category-button';
import { CategoriesTable } from '../quick-link-categories/_components/categories-table';

export const metadata = {
  title: 'Dashboard: Quick Links'
};

export default async function QuickLinksPage() {
  return (
    <PageContainer
      pageTitle="Quick Links"
      pageDescription="Manage sidebar links, downloads, and external resources — and their categories."
    >
      <Tabs defaultValue="links" className="space-y-4">
        <TabsList>
          <TabsTrigger value="links">Quick Links</TabsTrigger>
          <TabsTrigger value="categories">Link Categories</TabsTrigger>
        </TabsList>

        {/* ── Quick Links tab ── */}
        <TabsContent value="links" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Manage individual quick links, external resources, and sidebar
              links.
            </p>
            <AddQuickLinkButton />
          </div>
          <Suspense
            fallback={<DataTableSkeleton columnCount={6} rowCount={10} />}
          >
            <QuickLinksDataWrapper />
          </Suspense>
        </TabsContent>

        {/* ── Categories tab ── */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Categories organise quick links into groups. Create a category
              before adding links.
            </p>
            <AddCategoryButton />
          </div>
          <Suspense
            fallback={<DataTableSkeleton columnCount={6} rowCount={6} />}
          >
            <QLCategoriesDataWrapper />
          </Suspense>
        </TabsContent>
      </Tabs>
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

async function QLCategoriesDataWrapper() {
  const result = await getQuickLinkCategories();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const categories = result.data || [];
  return <CategoriesTable data={categories} />;
}
