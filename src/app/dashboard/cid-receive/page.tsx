import PageContainer from '@/components/layout/page-container';

export const metadata = {
  title: 'Dashboard: CID Receive'
};

export default function CidReceivePage() {
  return (
    <PageContainer
      pageTitle="CID Receive"
      pageDescription="Manage receipt of CID cards at collection points."
    >
      <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-gray-500">
        <p className="font-medium">CID Receive</p>
        <p className="text-xs text-gray-400">Coming soon</p>
      </div>
    </PageContainer>
  );
}
