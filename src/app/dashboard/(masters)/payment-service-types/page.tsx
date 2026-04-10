import PageContainer from '@/components/layout/page-container';
import { PaymentServiceTypesSearchBar } from './_components/search-bar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddPaymentServiceTypeButton } from './_components/add-payment-service-type-button';
import { PaymentServiceTypesListing } from './_components/payment-service-types-listing';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Dashboard: Payment Service Types'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function PaymentServiceTypesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle="Payment Service Types"
      pageDescription="Manage payment service types and pricing in the system."
      pageHeaderAction={<AddPaymentServiceTypeButton />}
    >
      <div className="space-y-4">
        <PaymentServiceTypesSearchBar />
        <Suspense
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <PaymentServiceTypesListing />
        </Suspense>
      </div>
    </PageContainer>
  );
}
