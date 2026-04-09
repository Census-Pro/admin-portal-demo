'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';

interface CidApplicationReason {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CidApplicationReasonsTableProps {
  data: CidApplicationReason[];
  totalData: number;
}

export function CidApplicationReasonsTable({
  data,
  totalData
}: CidApplicationReasonsTableProps) {
  return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
