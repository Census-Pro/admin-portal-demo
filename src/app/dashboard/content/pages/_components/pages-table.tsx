'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from './columns';
import { CmsPage } from '@/actions/common/cms-actions';
import { usePagesTableFilters } from './use-pages-table-filters';

interface PagesTableProps {
  data: CmsPage[];
  addButton?: React.ReactNode;
}

export function PagesTable({ data, addButton }: PagesTableProps) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = usePagesTableFilters();

  // Filter data based on search query
  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(query) ||
      item.slug?.toLowerCase().includes(query) ||
      item.navigation?.label?.toLowerCase().includes(query) ||
      item.status?.toLowerCase().includes(query) ||
      item.created_by_name?.toLowerCase().includes(query) ||
      item.published_by_name?.toLowerCase().includes(query) ||
      item.updated_by_name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <DataTableSearch
            searchKey="pages"
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
