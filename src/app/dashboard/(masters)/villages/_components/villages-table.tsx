'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import AddVillageButton from './add-village-button';

interface VillagesTableProps {
  data: any[];
  totalData: number;
}

export default function VillagesTable({ data, totalData }: VillagesTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <AddVillageButton />
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
