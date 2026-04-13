import PageContainer from '@/components/layout/page-container';
import { columns } from './_components/approve-columns';
import { MoveInOutReceivingApproveTable } from './_components/move-in-out-receiving-approve-table';

export const metadata = { title: 'Move In/Out - Receiving - Approve' };

export default function MoveInOutReceivingApprovePage() {
  return (
    <PageContainer
      pageTitle="Move In/Out - Receiving - Approve"
      pageDescription="Review and approve move-in-out applications that have been endorsed and are being received at your dzongkhag"
    >
      <div className="space-y-4">
        <MoveInOutReceivingApproveTable columns={columns} />
      </div>
    </PageContainer>
  );
}
