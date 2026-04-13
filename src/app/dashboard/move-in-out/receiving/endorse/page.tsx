import PageContainer from '@/components/layout/page-container';
import { columns } from './_components/endorse-columns';
import { MoveInOutReceivingEndorseTable } from './_components/move-in-out-receiving-endorse-table';

export const metadata = { title: 'Move In/Out - Receiving - Endorse' };

export default function MoveInOutReceivingEndorsePage() {
  return (
    <PageContainer
      pageTitle="Move In/Out - Receiving - Endorse"
      pageDescription="Review and endorse move-in-out applications that have been verified and are being received at your gewog"
    >
      <div className="space-y-4">
        <MoveInOutReceivingEndorseTable columns={columns} />
      </div>
    </PageContainer>
  );
}
