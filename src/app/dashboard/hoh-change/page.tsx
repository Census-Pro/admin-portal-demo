import PageContainer from '@/components/layout/page-container';
import { columns } from './_components/columns';
import { HohChangeTable } from './_components/hoh-change-table';

export const metadata = {
  title: 'Dashboard: HOH Change'
};

export default function HohChangePage() {
  return (
    <PageContainer
      pageTitle="HOH Change Management"
      pageDescription="Manage head of household change applications"
    >
      <div className="space-y-4">
        <HohChangeTable columns={columns} />
      </div>
    </PageContainer>
  );
}
