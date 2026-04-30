'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';

interface Gewog {
  id: string;
  name: string;
  dzongkhagId: string;
  dzongkhagName: string;
  isActive: boolean;
}

interface GewogsTableProps {
  data: Gewog[];
  totalData: number;
}

export function GewogsTable({ data, totalData }: GewogsTableProps) {
  return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
