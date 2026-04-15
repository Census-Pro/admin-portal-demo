'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  IconEdit,
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AddPaymentServiceTypeModal } from './add-payment-service-type-modal';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { formatPaymentType } from '@/lib/utils/payment-type-formatter';

interface PaymentServiceType {
  id: string;
  payment_type: string;
  service_code: string;
  currency: string;
  amount: number;
}

export const columns: ColumnDef<PaymentServiceType>[] = [
  {
    accessorKey: 'payment_type',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 gap-1"
      >
        Payment Type
        {column.getIsSorted() === 'asc' ? (
          <IconSortAscending className="h-4 w-4" />
        ) : column.getIsSorted() === 'desc' ? (
          <IconSortDescending className="h-4 w-4" />
        ) : (
          <IconArrowsSort className="h-4 w-4 opacity-50" />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.original;
      const formattedType = formatPaymentType(type.payment_type);
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {formattedType.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{formattedType}</div>
        </div>
      );
    }
  },
  {
    accessorKey: 'service_code',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 gap-1"
      >
        Service Code
        {column.getIsSorted() === 'asc' ? (
          <IconSortAscending className="h-4 w-4" />
        ) : column.getIsSorted() === 'desc' ? (
          <IconSortDescending className="h-4 w-4" />
        ) : (
          <IconArrowsSort className="h-4 w-4 opacity-50" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-mono">
        {row.original.service_code}
      </Badge>
    )
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.currency}
      </span>
    )
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 gap-1"
      >
        Amount
        {column.getIsSorted() === 'asc' ? (
          <IconSortAscending className="h-4 w-4" />
        ) : column.getIsSorted() === 'desc' ? (
          <IconSortDescending className="h-4 w-4" />
        ) : (
          <IconArrowsSort className="h-4 w-4 opacity-50" />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.original.amount;
      const currency = row.original.currency;
      const amountNumber =
        typeof amount === 'number' ? amount : parseFloat(amount) || 0;
      return (
        <span className="font-semibold">
          {currency} {amountNumber.toFixed(2)}
        </span>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const type = row.original;
      return <ActionsCell type={type} />;
    }
  }
];

function ActionsCell({ type }: { type: PaymentServiceType }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();

  const handleEditSuccess = () => {
    setIsEditOpen(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditOpen(true)}
          className="h-8 w-8"
        >
          <IconEdit className="h-4 w-4" />
        </Button>
      </div>

      <AddPaymentServiceTypeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleEditSuccess}
        initialData={type}
      />
    </>
  );
}
