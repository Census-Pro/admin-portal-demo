'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { QuickLinkCategory } from '@/actions/common/cms-actions';

interface CategoriesTableProps {
  data: QuickLinkCategory[];
}

export function CategoriesTable({ data }: CategoriesTableProps) {
  return <DataTable columns={columns} data={data} totalItems={data.length} />;
}
