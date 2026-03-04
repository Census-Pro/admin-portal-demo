'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';

interface VillagesTableProps {
  data: any[];
  totalData: number;
}

export default function VillagesTable({ data, totalData }: VillagesTableProps) {
  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
