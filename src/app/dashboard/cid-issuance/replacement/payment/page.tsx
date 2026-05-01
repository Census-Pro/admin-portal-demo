import PageContainer from '@/components/layout/page-container';
import { CidReplacementPaymentTable } from './_components/payment-table';

export const metadata = {
  title: 'Dashboard: CID Replacement - Payment'
};

export default function ReplacementPaymentPage() {
  return (
    <PageContainer
      pageTitle="CID Replacement - Payment Verification"
      pageDescription="Verify and process payments for CID replacement applications."
    >
      <CidReplacementPaymentTable />
    </PageContainer>
  );
}
