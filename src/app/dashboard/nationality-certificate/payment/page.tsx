import PageContainer from '@/components/layout/page-container';
import { NcPaymentTable } from './_components/payment-table';
import { PaymentSearchBar } from './_components/search-bar';

export const metadata = {
  title: 'Dashboard: Nationality Certificate - Payment'
};

export default function NationalityCertificatePaymentPage() {
  return (
    <PageContainer
      pageTitle="Nationality Certificate - Payment"
      pageDescription="Assessed applications with pending payment."
    >
      <div className="space-y-4">
        <PaymentSearchBar />
        <NcPaymentTable />
      </div>
    </PageContainer>
  );
}
