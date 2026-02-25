'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { Suspense } from 'react';

export default function MediaLibraryPage() {
  return (
    <PageContainer
      pageTitle="Media Library"
      pageDescription="Manage media assets (images, documents, videos)."
      pageHeaderAction={
        <Button>
          <Icons.add className="mr-2 h-4 w-4" /> Upload Media
        </Button>
      }
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <div className="text-muted-foreground flex h-[400px] items-center justify-center rounded-md border border-dashed text-sm">
            Media library implementation pending data schema...
          </div>
        </Suspense>
      </div>
    </PageContainer>
  );
}
