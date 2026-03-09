'use client';

import { useState, useEffect, useMemo } from 'react';
import { createColumns } from './columns';
import {
  NavigationItem,
  updateNavigationItem
} from '@/actions/common/cms-actions';
import { SortableDataTable } from '@/components/ui/table/sortable-data-table';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface NavigationTableProps {
  data: NavigationItem[];
}

export function NavigationTable({ data }: NavigationTableProps) {
  const router = useRouter();
  const [items, setItems] = useState(data);

  useEffect(() => {
    setItems(data);
  }, [data]);

  // Optimistic status update — mutates only the changed row, no re-sort
  const handleStatusChange = (id: string, newStatus: 'active' | 'inactive') => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const columns = useMemo(() => createColumns(handleStatusChange), []);

  const handleReorder = async (newOrder: NavigationItem[]) => {
    const oldItems = [...items];
    setItems(newOrder);

    try {
      const updates = newOrder.map((item, index) =>
        updateNavigationItem(item.id, { order: index + 1 })
      );

      const results = await Promise.all(updates);
      const hasError = results.some((r) => !r.success);

      if (hasError) {
        console.error('[handleReorder] Some navigation order updates failed');
        toast.error('Failed to update some navigation orders');
        setItems(oldItems);
      } else {
        toast.success('Navigation order updated successfully');
        router.refresh();
      }
    } catch (error) {
      console.error('[handleReorder] Exception:', error);
      toast.error('Error updating navigation order');
      setItems(oldItems);
    }
  };

  return (
    <SortableDataTable
      columns={columns}
      data={items}
      totalItems={items.length}
      onReorder={handleReorder}
    />
  );
}
