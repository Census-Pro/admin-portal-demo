import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import VillagesListingPage from './_components/villages-listing';
import { SearchParams } from 'nuqs/server';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function page({ searchParams }: PageProps) {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs />

        <div className="flex items-start justify-between">
          <Heading
            title="Villages"
            description="Manage villages for the census system"
          />
        </div>
        <VillagesListingPage searchParams={await searchParams} />
      </div>
    </PageContainer>
  );
}
