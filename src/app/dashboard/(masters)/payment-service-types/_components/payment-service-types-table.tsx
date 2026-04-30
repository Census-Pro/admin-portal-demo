'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';

interface PaymentServiceType {
  id: string;
  name: string;
  isActive: boolean;
}

interface PaymentServiceTypesTableProps {
  data: PaymentServiceType[];
  totalData: number;
}

export function PaymentServiceTypesTable({
  data,
  totalData
}: PaymentServiceTypesTableProps) {
  return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
