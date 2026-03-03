import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { getAnnouncements } from '@/actions/common/cms-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AddAnnouncementButton } from './_components/add-announcement-button';
import { AnnouncementsTable } from './_components/announcements-table';

export const metadata = {
  title: 'Dashboard: Public Notices'
};

export default async function AnnouncementsPage() {
  return (
    <PageContainer
      pageTitle="Public Notices"
      pageDescription="Manage public notices and official updates for the portal."
      pageHeaderAction={<AddAnnouncementButton />}
    >
      <div className="space-y-4">
        <Suspense
          fallback={<DataTableSkeleton columnCount={6} rowCount={10} />}
        >
          <AnnouncementsDataWrapper />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function AnnouncementsDataWrapper() {
  const result = await getAnnouncements();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const announcements = result.data || [];

  return <AnnouncementsTable data={announcements} />;
}
