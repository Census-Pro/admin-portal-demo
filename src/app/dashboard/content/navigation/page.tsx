import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { getNavigationItems } from '@/actions/common/cms-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddNavigationButton } from './_components/add-navigation-button';
import { NavigationTable } from './_components/navigation-table';

export const metadata = {
  title: 'Dashboard: Navigation Links'
};

export default async function NavigationPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <PageContainer
      pageTitle="Navigation Links (NavLinks)"
      pageDescription="Manage main navigation menu items. Each nav item can have sub-links (content pages) as dropdowns."
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <NavigationDataWrapper />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function NavigationDataWrapper() {
  const result = await getNavigationItems();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const items = result.data || [];

  return <NavigationTable data={items} addButton={<AddNavigationButton />} />;
}
