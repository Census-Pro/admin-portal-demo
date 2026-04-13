import PageContainer from '@/components/layout/page-container';
import { columns } from './_components/relieving-columns';
import { MoveInOutApplicationsTable } from '../_components/move-in-out-applications-table';

export const metadata = {
  title: 'Move In/Out - Relieving'
};

export default function MoveInOutRelievingPage() {
  return (
    <PageContainer
      pageTitle="Move In/Out - Relieving"
      pageDescription="Review and manage move-in-out applications submitted for relieving"
    >
      <div className="space-y-4">
        <MoveInOutApplicationsTable columns={columns} />
      </div>
    </PageContainer>
  );
}
