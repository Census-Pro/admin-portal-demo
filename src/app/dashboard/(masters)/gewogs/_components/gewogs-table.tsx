'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';

interface Gewog {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GewogsTableProps {
  data: Gewog[];
  totalData: number;
}

export function GewogsTable({ data, totalData }: GewogsTableProps) {
  return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
