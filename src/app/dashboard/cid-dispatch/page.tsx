import PageContainer from '@/components/layout/page-container';

export const metadata = {
  title: 'Dashboard: CID Dispatch'
};

export default function CidDispatchPage() {
  return (
    <PageContainer
      pageTitle="CID Dispatch"
      pageDescription="Manage dispatch of CID cards to collection points."
    >
      <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-gray-500">
        <p className="font-medium">CID Dispatch</p>
        <p className="text-xs text-gray-400">Coming soon</p>
      </div>
    </PageContainer>
  );
}
