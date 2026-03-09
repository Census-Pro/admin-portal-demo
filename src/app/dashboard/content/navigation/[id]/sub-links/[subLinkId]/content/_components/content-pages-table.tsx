'use client';

import { useState } from 'react';
import { columns } from './columns';
import { CmsPage, SubLink, updateCmsPage } from '@/actions/common/cms-actions';
import { SortableDataTable } from '@/components/ui/table/sortable-data-table';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ContentPagesTableProps {
  data: CmsPage[];
  subLink: SubLink;
}

export function ContentPagesTable({ data, subLink }: ContentPagesTableProps) {
  const router = useRouter();
  const [items, setItems] = useState(data);

  const handleReorder = async (newOrder: CmsPage[]) => {
    const oldItems = [...items];
    setItems(newOrder);

    try {
      // Update order for each item
      const updates = newOrder.map((item, index) =>
        updateCmsPage(item.id, { order: index + 1 })
      );

      const results = await Promise.all(updates);
      const hasError = results.some((r) => !r.success);

      if (hasError) {
        toast.error('Failed to update some page orders');
        setItems(oldItems);
      } else {
        toast.success('Page order updated successfully');
        router.refresh();
      }
    } catch (error) {
      toast.error('Error updating page order');
      setItems(oldItems);
    }
  };

  return (
    <div className="space-y-4">
      <SortableDataTable
        columns={columns}
        data={items}
        totalItems={items.length}
        onReorder={handleReorder}
      />

      {items.length === 0 && (
        <div className="bg-muted/50 border-muted rounded-lg border-2 border-dashed p-12 text-center">
          <h3 className="text-lg font-semibold">No content pages yet</h3>
          <p className="text-muted-foreground mt-2">
            Create content pages under "{subLink.label}" to get started
          </p>
        </div>
      )}
    </div>
  );
}
