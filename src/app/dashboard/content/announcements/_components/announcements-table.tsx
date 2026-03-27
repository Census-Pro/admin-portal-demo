'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from './columns';
import { Announcement } from '@/actions/common/cms-actions';
import { useAnnouncementsTableFilters } from './use-announcements-table-filters';

interface AnnouncementsTableProps {
  data: Announcement[];
  addButton?: React.ReactNode;
}

export function AnnouncementsTable({
  data,
  addButton
}: AnnouncementsTableProps) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useAnnouncementsTableFilters();

  // Filter data based on search query
  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      item.headline?.toLowerCase().includes(query) ||
      item.message?.toLowerCase().includes(query) ||
      item.category?.name?.toLowerCase().includes(query) ||
      item.status?.toLowerCase().includes(query) ||
      item.created_by_name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <DataTableSearch
            searchKey="notices"
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
