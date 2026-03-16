'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';

interface Chiwog {
  id: string;
  name: string;
  dzongkha_name?: string;
  dzongkhag_id?: string;
  gewog_id?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChiwogsTableProps {
  data: Chiwog[];
  totalData: number;
}

export function ChiwogsTable({ data, totalData }: ChiwogsTableProps) {
  return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
