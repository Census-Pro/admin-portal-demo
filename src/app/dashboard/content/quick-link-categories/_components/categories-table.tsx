'use client';

import { useState, useEffect, useMemo } from 'react';
import { createColumns } from './columns';
import {
  QuickLinkCategory,
  updateQuickLinkCategory
} from '@/actions/common/cms-actions';
import { SortableDataTable } from '@/components/ui/table/sortable-data-table';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useQuickLinkCategoriesTableFilters } from './use-quick-link-categories-table-filters';

interface CategoriesTableProps {
  data: QuickLinkCategory[];
  addButton?: React.ReactNode;
}

export function CategoriesTable({ data, addButton }: CategoriesTableProps) {
  const router = useRouter();
  const [items, setItems] = useState(data);

  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useQuickLinkCategoriesTableFilters();

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
        item.name?.toLowerCase().includes(query) ||
        item.name_dzo?.toLowerCase().includes(query) ||
        item.slug?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
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

  const columns = useMemo(
    () => createColumns(handleStatusChange),
    [handleStatusChange]
  );

  const handleReorder = async (newOrder: QuickLinkCategory[]) => {
    const oldItems = [...items];
    setItems(newOrder);

    try {
      const updates = newOrder.map((item, index) =>
        updateQuickLinkCategory(item.id, { order: index })
      );

      const results = await Promise.all(updates);
      const hasError = results.some((r) => !r.success);

      if (hasError) {
        console.error(
          '[handleReorder] Some quick link category order updates failed'
        );
        toast.error('Failed to update some quick link category orders');
        setItems(oldItems);
      } else {
        toast.success('Quick link category order updated successfully');
        // Use router.refresh() instead of full page reload
        router.refresh();
      }
    } catch (error) {
      console.error('[handleReorder] Exception:', error);
      toast.error('Error updating quick link category order');
      setItems(oldItems);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <DataTableSearch
            searchKey="categories"
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
