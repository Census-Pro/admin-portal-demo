import { searchParamsCache } from '@/lib/searchparams';
import { getChiwogs } from '@/actions/common/chiwog-actions';
import { ChiwogsTable } from './chiwogs-table';

export async function ChiwogsListing() {
  const page = searchParamsCache.get('page') || 1;
  const search = searchParamsCache.get('q');
  const limit = searchParamsCache.get('limit') || 10;

  const filters = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    ...(search && { search })
  };

  const data = await getChiwogs(filters || {});
  const totalChiwogs = data?.totalChiwogs;
  const chiwogs = data?.chiwogs || [];

  return <ChiwogsTable data={chiwogs} totalData={totalChiwogs} />;
}
