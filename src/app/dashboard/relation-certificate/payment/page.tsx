import PageContainer from '@/components/layout/page-container';
import { PaymentTable } from './_components/payment-table';
import { PaymentSearchBar } from './_components/search-bar';

export const metadata = {
  title: 'Dashboard: Relation Certificate - Payment'
};

export default function RelationCertificatePaymentPage() {
  return (
    <PageContainer
      pageTitle="Relation Certificate - Payment"
      pageDescription="Assessed applications with pending payment."
    >
      <div className="space-y-4">
        <PaymentSearchBar />
        <PaymentTable />
      </div>
    </PageContainer>
  );
}
