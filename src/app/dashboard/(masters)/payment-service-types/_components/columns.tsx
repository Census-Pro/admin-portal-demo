'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  IconTrash,
  IconEdit,
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deletePaymentServiceType } from '@/actions/common/payment-service-type-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddPaymentServiceTypeModal } from './add-payment-service-type-modal';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

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
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {type.payment_type.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{type.payment_type}</div>
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deletePaymentServiceType(type.id);

      if (!result || !result.error) {
        toast.success('Payment service type deleted successfully');
        setDeleteDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to delete payment service type');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete payment service type error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

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
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          className="text-destructive hover:text-destructive h-8 w-8"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Payment Service Type"
        description={`Are you sure you want to delete "${type.payment_type}"? This action cannot be undone.`}
      />

      <AddPaymentServiceTypeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleEditSuccess}
        initialData={type}
      />
    </>
  );
}
