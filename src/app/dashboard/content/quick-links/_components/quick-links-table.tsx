'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from './columns';
import { QuickLink } from '@/actions/common/cms-actions';
import { useQuickLinksTableFilters } from './use-quick-links-table-filters';

interface QuickLinksTableProps {
  data: QuickLink[];
  addButton?: React.ReactNode;
}

export function QuickLinksTable({ data, addButton }: QuickLinksTableProps) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useQuickLinksTableFilters();

  // Filter data based on search query
  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(query) ||
      item.url?.toLowerCase().includes(query) ||
      item.category?.name?.toLowerCase().includes(query) ||
      item.type?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
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
      <DataTable
        columns={columns}
        data={filteredData}
        totalItems={filteredData.length}
      />
    </div>
  );
}
