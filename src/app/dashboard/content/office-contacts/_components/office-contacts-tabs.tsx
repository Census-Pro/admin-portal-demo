'use client';

import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OfficeContactsTabsProps {
  defaultValue: string;
  contactsContent: React.ReactNode;
  categoriesContent: React.ReactNode;
}

function OfficeContactsTabsInner({
  defaultValue,
  contactsContent,
  categoriesContent
}: OfficeContactsTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="space-y-2">
      <TabsList>
        <TabsTrigger value="contacts">Office Contacts</TabsTrigger>
        <TabsTrigger value="categories">Contact Categories</TabsTrigger>
      </TabsList>

      <TabsContent value="contacts" className="space-y-2">
        {contactsContent}
      </TabsContent>

      <TabsContent value="categories" className="space-y-2">
        {categoriesContent}
      </TabsContent>
    </Tabs>
  );
}

export const OfficeContactsTabs = dynamic(
  () => Promise.resolve(OfficeContactsTabsInner),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-2">
        <div className="bg-muted inline-flex h-9 w-fit items-center justify-center gap-2 rounded-lg p-[3px]">
          <div className="bg-muted-foreground/20 h-[calc(100%-1px)] flex-1 animate-pulse rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap" />
          <div className="bg-muted-foreground/20 h-[calc(100%-1px)] flex-1 animate-pulse rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap" />
        </div>
        <div className="bg-muted/20 h-32 flex-1 animate-pulse space-y-2 rounded-lg outline-none" />
      </div>
    )
  }
);
