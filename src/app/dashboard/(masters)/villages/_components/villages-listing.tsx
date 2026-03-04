import { SearchParams } from 'nuqs/server';
import { getAllVillages } from '@/actions/common/village-actions';
import VillagesTable from './villages-table';

type VillagesListingPageProps = {
  searchParams: SearchParams;
};

export default async function VillagesListingPage({
  searchParams
}: VillagesListingPageProps) {
  const result = await getAllVillages();

  const villages = result?.error ? [] : result?.data || [];
  const totalVillages = villages.length;

  return <VillagesTable data={villages} totalData={totalVillages} />;
}
