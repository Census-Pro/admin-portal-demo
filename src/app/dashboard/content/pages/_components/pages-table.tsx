'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { CmsPage } from '@/actions/common/cms-actions';

interface PagesTableProps {
  data: CmsPage[];
}

export function PagesTable({ data }: PagesTableProps) {
  return <DataTable columns={columns} data={data} totalItems={data.length} />;
}
