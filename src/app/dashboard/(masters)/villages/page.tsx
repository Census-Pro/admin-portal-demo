import PageContainer from '@/components/layout/page-container';
import VillagesListingPage from './_components/villages-listing';
import { SearchParams } from 'nuqs/server';

import AddVillageButton from './_components/add-village-button';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function page({ searchParams }: PageProps) {
  return (
    <PageContainer
      pageTitle="Villages"
      pageDescription="Manage villages for the census system"
      pageHeaderAction={<AddVillageButton />}
    >
      <div className="space-y-4">
        <VillagesListingPage searchParams={await searchParams} />
      </div>
    </PageContainer>
  );
}
