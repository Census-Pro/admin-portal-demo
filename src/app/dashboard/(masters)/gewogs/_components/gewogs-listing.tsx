import { searchParamsCache } from '@/lib/searchparams';
import { getGewogs } from '@/actions/common/gewog-actions';
import { GewogsTable } from './gewogs-table';

export async function GewogsListing() {
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
  const data = await getGewogs(filters || {});
  const totalGewogs = data?.totalGewogs || 0;
  const gewogs = data?.gewogs || [];

  return <GewogsTable data={gewogs} totalData={totalGewogs} />;
}
