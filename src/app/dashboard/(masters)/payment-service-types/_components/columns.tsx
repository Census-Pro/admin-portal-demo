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

interface PaymentServiceType {
  id: string;
  name: string;
  isActive: boolean;
}

export const columns: ColumnDef<PaymentServiceType>[] = [
  {
    accessorKey: 'name',
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
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {type.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{type.name}</div>
        </div>
      );
    }
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const type = row.original;
      return (
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              type.isActive ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm font-medium">
            {type.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
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
      />
    </>
  );
}
