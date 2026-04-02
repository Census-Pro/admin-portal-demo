'use client';

import { useState, useEffect, useMemo } from 'react';
import { createColumns } from './columns';
import { Faq, updateFaq } from '@/actions/common/cms-actions';
import { SortableDataTable } from '@/components/ui/table/sortable-data-table';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useFaqsTableFilters } from './use-faqs-table-filters';

interface FaqsTableProps {
  data: Faq[];
  addButton?: React.ReactNode;
}

export function FaqsTable({ data, addButton }: FaqsTableProps) {
  const router = useRouter();
  const [items, setItems] = useState<Faq[]>([]);

  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useFaqsTableFilters();

  useEffect(() => {
    // Sort data by order when it changes
    if (data && Array.isArray(data)) {
      const sortedData = [...data].sort(
        (a, b) => (a.order_index || 0) - (b.order_index || 0)
      );
      setItems(sortedData);
    }
  }, [data]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return items;

    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.question?.toLowerCase().includes(query) ||
        item.answer?.toLowerCase().includes(query) ||
        item.category?.name?.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  // Optimistic status update — mutates only the changed row, no re-sort
  const handleStatusChange = (id: string, newStatus: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: newStatus ? 'active' : 'inactive' }
          : item
      )
    );
  };

  const columns = useMemo(() => createColumns(handleStatusChange), []);

  const handleReorder = async (newOrder: Faq[]) => {
    const oldItems = [...items];
    setItems(newOrder);

    try {
      const updates = newOrder.map((item, index) =>
        updateFaq(item.id, { order_index: index })
      );

      const results = await Promise.all(updates);
      const hasError = results.some((r) => !r.success);

      if (hasError) {
        console.error('[handleReorder] Some FAQ order updates failed');
        toast.error('Failed to update some FAQ orders');
        setItems(oldItems);
      } else {
        toast.success('FAQ order updated successfully');
        // Use router.refresh() instead of full page reload
        router.refresh();
      }
    } catch (error) {
      console.error('[handleReorder] Exception:', error);
      toast.error('Error updating FAQ order');
      setItems(oldItems);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <DataTableSearch
            searchKey="FAQs"
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
