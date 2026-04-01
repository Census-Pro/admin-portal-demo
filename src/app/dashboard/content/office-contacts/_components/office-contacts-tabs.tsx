'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OfficeContactsTabsProps {
  defaultValue: string;
  contactsContent: React.ReactNode;
  categoriesContent: React.ReactNode;
}

export function OfficeContactsTabs({
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
