import PageContainer from '@/components/layout/page-container';
import { PaymentTable } from './_components/payment-table';

export const metadata = {
  title: 'Dashboard: Relation Certificate - Payment'
};

export default function RelationCertificatePaymentPage() {
  return (
    <PageContainer
      pageTitle="Relation Certificate - Payment"
      pageDescription="Assessed applications with pending payment."
    >
      <PaymentTable />
    </PageContainer>
  );
}
