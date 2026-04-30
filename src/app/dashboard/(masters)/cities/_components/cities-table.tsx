'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';

interface City {
  id: string;
  name: string;
  dzongkhagId: string;
  dzongkhagName: string;
  isActive: boolean;
}

interface CitiesTableProps {
  data: City[];
  totalData: number;
}

export function CitiesTable({ data, totalData }: CitiesTableProps) {
  return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
