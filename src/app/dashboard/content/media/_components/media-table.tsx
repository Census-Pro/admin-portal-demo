'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { MediaItem } from '@/actions/common/cms-actions';

interface MediaTableProps {
  data: MediaItem[];
}

export function MediaTable({ data }: MediaTableProps) {
  return <DataTable columns={columns} data={data} totalItems={data.length} />;
}
