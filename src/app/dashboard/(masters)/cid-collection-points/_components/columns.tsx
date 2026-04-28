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
import { deleteCidCollectionPoint } from '@/actions/common/cid-collection-point-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { EditCidCollectionPointModal } from './edit-cid-collection-point-modal';

interface CidCollectionPoint {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export const columns = (
  onDataChange?: () => void
): ColumnDef<CidCollectionPoint>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 gap-1"
      >
        Collection Point Name
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
      const collectionPoint = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {collectionPoint.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{collectionPoint.name}</div>
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
      const collectionPoint = row.original;
      return (
        <ActionsCell
          collectionPoint={collectionPoint}
          onDataChange={onDataChange}
        />
      );
    }
  }
];

function ActionsCell({
  collectionPoint,
  onDataChange
}: {
  collectionPoint: CidCollectionPoint;
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
    const result = await deleteCidCollectionPoint(collectionPoint.id);

    if (result.success) {
      toast.success('CID collection point deleted successfully');
      setDeleteDialogOpen(false);
      onDataChange?.();
    } else {
      toast.error(result.error || 'Failed to delete CID collection point');
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
        title="Delete CID Collection Point"
        description={`Are you sure you want to delete "${collectionPoint.name}"? This action cannot be undone.`}
      />

      <EditCidCollectionPointModal
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        collectionPoint={collectionPoint}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
