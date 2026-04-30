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
import { deleteOperator } from '@/actions/common/operator-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { EditOperatorModal } from './edit-operator-modal';

interface Operator {
  id: string;
  name: string;
  cidNo: string;
  isActive: boolean;
}

export const columns = (onDataChange?: () => void): ColumnDef<Operator>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 gap-1"
      >
        Name
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
      const operator = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {operator.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{operator.name}</div>
        </div>
      );
    }
  },
  {
    accessorKey: 'cidNo',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 gap-1"
      >
        CID Number
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
      const operator = row.original;
      return <div className="font-mono font-medium">{operator.cidNo}</div>;
    }
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const operator = row.original;
      return (
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              operator.isActive ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm font-medium">
            {operator.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const operator = row.original;
      return <ActionsCell operator={operator} onDataChange={onDataChange} />;
    }
  }
];

function ActionsCell({
  operator,
  onDataChange
}: {
  operator: Operator;
  onDataChange?: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteOperator(operator.id);

    if (result.success) {
      toast.success('Operator deleted successfully');
      setDeleteDialogOpen(false);
      onDataChange?.();
    } else {
      toast.error(result.error || 'Failed to delete operator');
    }

    setIsDeleting(false);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    onDataChange?.();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleEditClick}
        className="text-muted-foreground hover:text-foreground"
      >
        <IconEdit className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDeleteClick}
        className="text-destructive hover:text-destructive"
      >
        <IconTrash className="h-4 w-4" />
      </Button>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Operator"
        description={`Are you sure you want to delete operator with CID ${operator.cidNo}? This action cannot be undone.`}
      />

      <EditOperatorModal
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        operator={operator}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
