import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { getMediaItems } from '@/actions/common/cms-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddMediaButton } from './_components/add-media-button';
import { MediaTable } from './_components/media-table';

export const metadata = {
  title: 'Dashboard: Media Library'
};

export default async function MediaLibraryPage() {
  return (
    <PageContainer
      pageTitle="Media Library"
      pageDescription="Manage media assets (images, documents, videos)."
      pageHeaderAction={<AddMediaButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
        >
          <MediaDataWrapper />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function MediaDataWrapper() {
  const result = await getMediaItems();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const media = result.data || [];

  return <MediaTable data={media} />;
}
