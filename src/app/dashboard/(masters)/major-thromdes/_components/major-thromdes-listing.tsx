import { searchParamsCache } from '@/lib/searchparams';
import { getMajorThromdes } from '@/actions/common/major-thromde-actions';
import { MajorThromdesTable } from './major-thromdes-table';

export async function MajorThromdesListing() {
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
  const data = await getMajorThromdes(filters || {});
  const totalMajorThromdes = data?.totalMajorThromdes;
  const majorThromdes = data?.majorThromdes || [];

  return (
    <MajorThromdesTable data={majorThromdes} totalData={totalMajorThromdes} />
  );
}
