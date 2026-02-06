'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';

interface City {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CitiesTableProps {
  data: City[];
  totalData: number;
}

export function CitiesTable({ data, totalData }: CitiesTableProps) {
  return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
