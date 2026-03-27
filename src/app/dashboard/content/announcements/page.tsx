import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  getAnnouncements,
  getAnnouncementCategories
} from '@/actions/common/cms-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AnnouncementsTable } from './_components/announcements-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriesTable } from '../categories/_components/categories-table';

export const metadata = {
  title: 'Dashboard: Public Notices'
};

export default async function AnnouncementsPage({
  searchParams
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const { tab } = await searchParams;
  const defaultTab = tab === 'categories' ? 'categories' : 'notices';
  return (
    <PageContainer
      pageTitle="Public Notices"
      pageDescription="Manage notices and the categories used to organise them."
    >
      <Tabs defaultValue={defaultTab} className="space-y-2">
        <TabsList>
          <TabsTrigger value="notices">Notices</TabsTrigger>
          <TabsTrigger value="categories">Notice Categories</TabsTrigger>
        </TabsList>

        {/* ── Notices tab ── */}
        <TabsContent value="notices" className="space-y-2">
          <Suspense
            fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
          >
            <AnnouncementsDataWrapper />
          </Suspense>
        </TabsContent>

        {/* ── Categories tab ── */}
        <TabsContent value="categories" className="space-y-2">
          <Suspense
            fallback={<DataTableSkeleton columnCount={5} rowCount={6} />}
          >
            <CategoriesDataWrapper />
          </Suspense>
        </TabsContent>
      </Tabs>
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

async function CategoriesDataWrapper() {
  const result = await getAnnouncementCategories();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const categories = result.data || [];
  return <CategoriesTable data={categories} />;
}
