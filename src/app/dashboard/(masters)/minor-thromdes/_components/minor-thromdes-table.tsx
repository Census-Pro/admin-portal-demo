'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';

interface MinorThromde {
  id: string;
  thromdeName: string;
  dzongkhagName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MinorThromdesTableProps {
  data: MinorThromde[];
  totalData: number;
}

export function MinorThromdesTable({
  data,
  totalData
}: MinorThromdesTableProps) {
  return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
