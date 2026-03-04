import { SearchParams } from 'nuqs/server';
import { getVillages } from '@/actions/common/village-actions';
import VillagesTable from './villages-table';
import { searchParamsCache } from '@/lib/searchparams';

type VillagesListingPageProps = {
  searchParams: SearchParams;
};

export default async function VillagesListingPage({
  searchParams
}: VillagesListingPageProps) {
  const { page, limit, q } = searchParamsCache.parse(searchParams);

  const { villages, totalVillages } = await getVillages({
    page,
    limit,
    search: q || undefined
  });

  return <VillagesTable data={villages} totalData={totalVillages} />;
}
