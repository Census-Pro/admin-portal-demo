import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { getAnnouncementCategories } from '@/actions/common/cms-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddCategoryButton } from './_components/add-category-button';
import { CategoriesTable } from './_components/categories-table';

export const metadata = {
  title: 'Dashboard: Notice Categories'
};

export default async function CategoriesPage() {
  return (
    <PageContainer
      pageTitle="Notice Categories"
      pageDescription="Manage categories for organizing public notices and official updates."
      pageHeaderAction={<AddCategoryButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <CategoriesDataWrapper />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function CategoriesDataWrapper() {
  const result = await getAnnouncementCategories();

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
