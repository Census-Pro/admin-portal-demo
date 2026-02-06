import { searchParamsCache } from '@/lib/searchparams';
import { getCities } from '@/actions/common/city-actions';
import { CitiesTable } from './cities-table';

export async function CitiesListing() {
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
  const data = await getCities(filters || {});
  const totalCities = data?.totalCities;
  const cities = data?.cities || [];

  return <CitiesTable data={cities} totalData={totalCities} />;
}
