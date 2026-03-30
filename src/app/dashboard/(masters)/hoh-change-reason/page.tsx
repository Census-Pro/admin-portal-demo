import PageContainer from '@/components/layout/page-container';
import { HohChangeReasonSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddHohChangeReasonButton } from './_components/add-hoh-change-reason-button';
import { HohChangeReasonTable } from './_components/hoh-change-reason-table';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: HOH Change Reason Management'
};

export default function HohChangeReasonManagementPage() {
  return (
    <PageContainer
      pageTitle="HOH Change Reason Management"
      pageDescription="Manage HOH change reasons in the system."
      pageHeaderAction={<AddHohChangeReasonButton />}
    >
      <div className="space-y-4">
        <HohChangeReasonSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
        >
          <HohChangeReasonTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
