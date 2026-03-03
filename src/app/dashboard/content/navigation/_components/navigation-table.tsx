'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { NavigationItem } from '@/actions/common/cms-actions';

interface NavigationTableProps {
  data: NavigationItem[];
}

export function NavigationTable({ data }: NavigationTableProps) {
  return <DataTable columns={columns} data={data} totalItems={data.length} />;
}
