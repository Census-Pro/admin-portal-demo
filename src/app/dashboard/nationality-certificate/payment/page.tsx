import PageContainer from '@/components/layout/page-container';
import { NcPaymentTable } from './_components/payment-table';

export const metadata = {
  title: 'Dashboard: Nationality Certificate - Payment'
};

export default function NationalityCertificatePaymentPage() {
  return (
    <PageContainer
      pageTitle="Nationality Certificate - Payment"
      pageDescription="Assessed applications with pending payment."
    >
      <NcPaymentTable />
    </PageContainer>
  );
}
