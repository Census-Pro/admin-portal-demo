import { searchParamsCache } from '@/lib/searchparams';
import { getPaymentServiceTypes } from '@/actions/common/payment-service-type-actions';
import { PaymentServiceTypesTable } from './payment-service-types-table';

export async function PaymentServiceTypesListing() {
  // Get search params
  const page = searchParamsCache.get('page') || 1;
  const search = searchParamsCache.get('q');
  const limit = searchParamsCache.get('limit') || 10;

  // Parse filters
  const filters = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    ...(search && { search })
  };

  // API call
  const data = await getPaymentServiceTypes(filters || {});
  const totalPaymentServiceTypes = data?.meta?.itemCount || 0;
  const paymentServiceTypes = data?.data || [];

  return (
    <PaymentServiceTypesTable
      data={paymentServiceTypes}
      totalData={totalPaymentServiceTypes}
    />
  );
}
