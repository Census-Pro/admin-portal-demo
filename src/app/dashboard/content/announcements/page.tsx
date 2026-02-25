'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { Suspense } from 'react';

export default function AnnouncementsPage() {
  return (
    <PageContainer
      pageTitle="Announcements & News"
      pageDescription="Manage announcements and news for the portal."
      pageHeaderAction={
        <Button>
          <Icons.add className="mr-2 h-4 w-4" /> Add Announcement
        </Button>
      }
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <div className="text-muted-foreground flex h-[400px] items-center justify-center rounded-md border border-dashed text-sm">
            Announcements table implementation pending data schema...
          </div>
        </Suspense>
      </div>
    </PageContainer>
  );
}
