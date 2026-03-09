'use client';

import { useState, useEffect, useMemo } from 'react';
import { createColumns } from './columns';
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

  // Sync items when server-side data changes (after router.refresh())
  useEffect(() => {
    setItems(data);
  }, [data]);

  // Optimistic status update — mutates only the changed row, no re-sort
  const handleStatusChange = (id: string, newStatus: 'published' | 'draft') => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const columns = useMemo(() => createColumns(handleStatusChange), []);

  const handleReorder = async (newOrder: CmsPage[]) => {
    const oldItems = [...items];
    setItems(newOrder);

    try {
      const updates = newOrder.map((item, index) =>
        updateCmsPage(item.id, { order: index + 1 })
      );

      const results = await Promise.all(updates);
      const hasError = results.some((r) => !r.success);

      if (hasError) {
        const errors = results.filter((r) => !r.success);
        console.error('[handleReorder] Errors:', errors);
        toast.error('Failed to update some page orders');
        setItems(oldItems);
      } else {
        toast.success('Page order updated successfully');
        router.refresh();
      }
    } catch (error) {
      console.error('[handleReorder] Exception:', error);
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
