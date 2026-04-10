'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';

interface PaymentServiceType {
  id: string;
  payment_type: string;
  service_code: string;
  currency: string;
  amount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
