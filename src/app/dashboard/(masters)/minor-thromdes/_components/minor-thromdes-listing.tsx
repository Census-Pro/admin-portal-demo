import { searchParamsCache } from '@/lib/searchparams';
import { getMinorThromdes } from '@/actions/common/minor-thromde-actions';
import { MinorThromdesTable } from './minor-thromdes-table';

export async function MinorThromdesListing() {
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
  const data = await getMinorThromdes(filters || {});
  const totalMinorThromdes = data?.totalMinorThromdes;
  const minorThromdes = data?.minorThromdes || [];

  return (
    <MinorThromdesTable data={minorThromdes} totalData={totalMinorThromdes} />
  );
}
