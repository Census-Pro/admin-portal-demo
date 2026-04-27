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
import { deleteResettlement } from '@/actions/common/resettlement-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { EditResettlementModal } from './edit-resettlement-modal';

interface Resettlement {
  id: string;
  cidNo: string;
  createdAt?: string;
  updatedAt?: string;
}

export const columns = (
  onDataChange?: () => void
): ColumnDef<Resettlement>[] => [
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
      const resettlement = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {resettlement.cidNo?.charAt(0) || '?'}
          </div>
          <div>
            <div className="font-mono font-medium">
              {resettlement.cidNo || '-'}
            </div>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created Date',
    cell: ({ row }) => {
      const date = row.getValue('createdAt');
      if (!date) return <span className="text-muted-foreground">-</span>;

      return (
        <span className="text-muted-foreground text-sm">
          {new Date(date as string).toLocaleDateString('en-BT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const resettlement = row.original;
      return (
        <ActionsCell resettlement={resettlement} onDataChange={onDataChange} />
      );
    }
  }
];

function ActionsCell({
  resettlement,
  onDataChange
}: {
  resettlement: Resettlement;
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
    const result = await deleteResettlement(resettlement.id);

    if (result.success) {
      toast.success('Resettlement deleted successfully');
      setDeleteDialogOpen(false);
      onDataChange?.();
    } else {
      toast.error(result.error || 'Failed to delete resettlement');
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
        title="Delete Resettlement"
        description={`Are you sure you want to delete resettlement with CID ${resettlement.cidNo}? This action cannot be undone.`}
      />

      <EditResettlementModal
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        resettlement={resettlement}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
