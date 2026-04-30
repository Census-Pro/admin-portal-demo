import { searchParamsCache } from '@/lib/searchparams';
import { getCidApplicationReasons } from '@/actions/common/cid-application-reason-actions';
import { CidApplicationReasonsTable } from './cid-application-reasons-table';

export async function CidApplicationReasonsListing() {
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
  const data = await getCidApplicationReasons(filters || {});
  const totalCidApplicationReasons = data?.meta?.itemCount || 0;
  const cidApplicationReasons = data?.data || [];

  return (
    <CidApplicationReasonsTable
      data={cidApplicationReasons}
      totalData={totalCidApplicationReasons}
    />
  );
}
