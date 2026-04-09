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
import { deleteMinorThromde } from '@/actions/common/minor-thromde-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddMinorThromdeModal } from './add-minor-thromde-modal';

interface MinorThromde {
  id: string;
  thromdeName: string;
  dzongkhagName: string;
}

export const columns: ColumnDef<MinorThromde>[] = [
  {
    accessorKey: 'thromdeName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 gap-1"
      >
        Thromde Name
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
      const minorThromde = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {minorThromde.thromdeName.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{minorThromde.thromdeName}</div>
        </div>
      );
    }
  },
  {
    accessorKey: 'dzongkhagName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 gap-1"
      >
        Dzongkhag
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
      const minorThromde = row.original;
      return <div>{minorThromde.dzongkhagName}</div>;
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const minorThromde = row.original;
      return <ActionsCell minorThromde={minorThromde} />;
    }
  }
];

function ActionsCell({ minorThromde }: { minorThromde: MinorThromde }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteMinorThromde(minorThromde.id);

      if (!result || !result.error) {
        toast.success('Minor thromde deleted successfully');
        setDeleteDialogOpen(false);
      } else {
        toast.error(result.message || 'Failed to delete minor thromde');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete minor thromde error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={`Delete "${minorThromde.thromdeName}"`}
        description="Are you sure you want to delete this minor thromde? This action cannot be undone."
      />

      <AddMinorThromdeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={minorThromde}
      />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditOpen(true)}
          className="hover:bg-accent h-8 w-8"
        >
          <IconEdit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
