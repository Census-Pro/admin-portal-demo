import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { getOfficeCategories } from '@/actions/common/cms-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { CategoriesTable } from './_components/categories-table';
import { AddCategoryButton } from './_components/add-category-button';

export const metadata = {
  title: 'Dashboard: Office Contact Categories'
};

export default async function OfficeCategoriesPage() {
  return (
    <PageContainer
      pageTitle="Office Contact Categories"
      pageDescription="Manage categories for organizing office contact information."
    >
      <Suspense fallback={<DataTableSkeleton columnCount={6} rowCount={6} />}>
        <CategoriesDataWrapper addButton={<AddCategoryButton />} />
      </Suspense>
    </PageContainer>
  );
}

async function CategoriesDataWrapper({
  addButton
}: {
  addButton?: React.ReactNode;
}) {
  const result = await getOfficeCategories();

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
