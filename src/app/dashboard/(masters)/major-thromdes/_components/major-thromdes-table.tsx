'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';

interface MajorThromde {
  id: string;
  thromdeName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MajorThromdesTableProps {
  data: MajorThromde[];
  totalData: number;
}

export function MajorThromdesTable({
  data,
  totalData
}: MajorThromdesTableProps) {
  return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
