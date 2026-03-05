import PageContainer from '@/components/layout/page-container';
import { NaturalizationTypesSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddNaturalizationTypeButton } from './_components/add-naturalization-type-button';
import { NaturalizationTypesTable } from './_components/naturalization-types-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Naturalization Type Management'
};

export default function NaturalizationTypeManagementPage() {
  return (
    <PageContainer
      pageTitle="Naturalization Type Management"
      pageDescription="Manage naturalization types in the system."
      pageHeaderAction={<AddNaturalizationTypeButton />}
    >
      <div className="space-y-4">
        <NaturalizationTypesSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <NaturalizationTypesTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
