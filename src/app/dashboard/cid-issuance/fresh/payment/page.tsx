import PageContainer from '@/components/layout/page-container';
import { CidPaymentTable } from './_components/payment-table';

export const metadata = {
  title: 'Dashboard: Fresh CID - Payment'
};

export default function FreshPaymentPage() {
  return (
    <PageContainer
      pageTitle="Fresh CID - Payment Verification"
      pageDescription="Verify and process payments for new CID applications."
    >
      <CidPaymentTable />
    </PageContainer>
  );
}
