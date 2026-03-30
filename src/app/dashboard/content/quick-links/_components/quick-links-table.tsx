'use client';

import { useState, useEffect, useMemo } from 'react';
import { createColumns } from './columns';
import { QuickLink, updateQuickLink } from '@/actions/common/cms-actions';
import { SortableDataTable } from '@/components/ui/table/sortable-data-table';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useQuickLinksTableFilters } from './use-quick-links-table-filters';

interface QuickLinksTableProps {
  data: QuickLink[];
  addButton?: React.ReactNode;
}

export function QuickLinksTable({ data, addButton }: QuickLinksTableProps) {
  const router = useRouter();
  const [items, setItems] = useState(data);

  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useQuickLinksTableFilters();

  useEffect(() => {
    // Sort data by order when it changes
    const sortedData = [...data].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
    setItems(sortedData);
  }, [data]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return items;

    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        item.url?.toLowerCase().includes(query) ||
        item.category?.name?.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  // Optimistic status update — mutates only the changed row, no re-sort
  const handleStatusChange = (id: string, newStatus: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_active: newStatus } : item
      )
    );
  };

  const columns = useMemo(() => createColumns(handleStatusChange), []);

  const handleReorder = async (newOrder: QuickLink[]) => {
    const oldItems = [...items];
    setItems(newOrder);

    try {
      const updates = newOrder.map((item, index) =>
        updateQuickLink(item.id, { order: index })
      );

      const results = await Promise.all(updates);
      const hasError = results.some((r) => !r.success);

      if (hasError) {
        console.error('[handleReorder] Some quick link order updates failed');
        toast.error('Failed to update some quick link orders');
        setItems(oldItems);
      } else {
        toast.success('Quick link order updated successfully');
        // Use router.refresh() instead of full page reload
        router.refresh();
      }
    } catch (error) {
      console.error('[handleReorder] Exception:', error);
      toast.error('Error updating quick link order');
      setItems(oldItems);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <DataTableSearch
            searchKey="quick links"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPage={setPage}
          />
          <DataTableResetFilter
            isFilterActive={isAnyFilterActive}
            onReset={resetFilters}
          />
        </div>
        {addButton}
      </div>
      <SortableDataTable
        columns={columns}
        data={filteredData}
        totalItems={filteredData.length}
        onReorder={handleReorder}
      />
    </div>
  );
}
