'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';

interface FineType {
  id: string;
  name: string;
  isActive: boolean;
}

interface FineTypesTableProps {
  data: FineType[];
  totalData: number;
}

export function FineTypesTable({ data, totalData }: FineTypesTableProps) {
  return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
