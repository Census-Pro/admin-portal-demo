import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  getOfficeContacts,
  getOfficeCategories
} from '@/actions/common/cms-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { OfficeContactsTable } from './_components/office-contacts-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriesTable } from '../office-categories/_components/categories-table';
import { AddOfficeContactButton } from './_components/add-contact-button';
import { AddCategoryButton } from '../office-categories/_components/add-category-button';

export const metadata = {
  title: 'Dashboard: Office Contacts'
};

export default async function OfficeContactsPage({
  searchParams
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const { tab } = await searchParams;
  const defaultTab = tab === 'categories' ? 'categories' : 'contacts';
  return (
    <PageContainer
      pageTitle="Office Contacts"
      pageDescription="Manage office contact information and their categories."
    >
      <Tabs defaultValue={defaultTab} className="space-y-2">
        <TabsList>
          <TabsTrigger value="contacts">Office Contacts</TabsTrigger>
          <TabsTrigger value="categories">Contact Categories</TabsTrigger>
        </TabsList>

        {/* ── Office Contacts tab ── */}
        <TabsContent value="contacts" className="space-y-2">
          <Suspense
            fallback={<DataTableSkeleton columnCount={6} rowCount={10} />}
          >
            <OfficeContactsDataWrapper addButton={<AddOfficeContactButton />} />
          </Suspense>
        </TabsContent>

        {/* ── Categories tab ── */}
        <TabsContent value="categories" className="space-y-2">
          <Suspense
            fallback={<DataTableSkeleton columnCount={6} rowCount={6} />}
          >
            <CategoriesDataWrapper addButton={<AddCategoryButton />} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

async function OfficeContactsDataWrapper({
  addButton
}: {
  addButton?: React.ReactNode;
}) {
  const result = await getOfficeContacts();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const contacts = result.data || [];
  return <OfficeContactsTable data={contacts} addButton={addButton} />;
}

async function CategoriesDataWrapper({
  addButton
}: {
  addButton?: React.ReactNode;
}) {
  const result = await getOfficeCategories();

  if (!result.success) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const categories = result.data || [];
  return <CategoriesTable data={categories} addButton={addButton} />;
}
