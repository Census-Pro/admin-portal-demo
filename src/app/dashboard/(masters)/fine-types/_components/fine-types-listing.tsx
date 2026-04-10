import { searchParamsCache } from '@/lib/searchparams';
import { getFineTypes } from '@/actions/common/fine-type-actions';
import { FineTypesTable } from './fine-types-table';

export async function FineTypesListing() {
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
  const data = await getFineTypes(filters || {});
  const totalFineTypes = data?.totalFineTypes;
  const fineTypes = data?.fineTypes || [];

  return <FineTypesTable data={fineTypes} totalData={totalFineTypes} />;
}
