'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { QuickLink } from '@/actions/common/cms-actions';

interface QuickLinksTableProps {
  data: QuickLink[];
}

export function QuickLinksTable({ data }: QuickLinksTableProps) {
  return <DataTable columns={columns} data={data} totalItems={data.length} />;
}
