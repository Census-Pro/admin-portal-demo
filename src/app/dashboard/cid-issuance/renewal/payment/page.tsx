import PageContainer from '@/components/layout/page-container';
import { CidRenewalPaymentTable } from './_components/payment-table';

export const metadata = {
  title: 'Dashboard: CID Renewal - Payment'
};

export default function RenewalPaymentPage() {
  return (
    <PageContainer
      pageTitle="CID Renewal - Payment Verification"
      pageDescription="Verify and process payments for CID renewal applications."
    >
      <CidRenewalPaymentTable />
    </PageContainer>
  );
}
