'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';

interface FineType {
  id: string;
  fine_type: string;
  name: string;
  service_code: string;
  currency: string;
  fine_value: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FineTypesTableProps {
  data: FineType[];
  totalData: number;
}

export function FineTypesTable({ data, totalData }: FineTypesTableProps) {
  return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
