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
import { deleteChiwog } from '@/actions/common/chiwog-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddChiwogModal } from './add-chiwog-modal';

interface Chiwog {
  id: string;
  name: string;
  dzongkha_name?: string;
  dzongkhag_id?: string;
  gewog_id?: string;
}

export const columns: ColumnDef<Chiwog>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 gap-1"
      >
        Chiwog Name
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
      const chiwog = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {chiwog.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{chiwog.name}</div>
        </div>
      );
    }
  },
  {
    accessorKey: 'dzongkha_name',
    header: 'Dzongkha Name',
    cell: ({ row }) => {
      const chiwog = row.original;
      return <div className="font-medium">{chiwog.dzongkha_name || '-'}</div>;
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const chiwog = row.original;
      return <ActionsCell chiwog={chiwog} />;
    }
  }
];

function ActionsCell({ chiwog }: { chiwog: Chiwog }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteChiwog(chiwog.id);

      if (!result || !result.error) {
        toast.success('Chiwog deleted successfully');
        setDeleteDialogOpen(false);
      } else {
        toast.error(result.message || 'Failed to delete chiwog');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete chiwog error:', error);
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
        title={`Delete "${chiwog.name}"`}
        description="Are you sure you want to delete this chiwog? This action cannot be undone."
        confirmText="Delete Chiwog"
      />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditOpen(true)}
          disabled={isDeleting}
        >
          <IconEdit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="text-destructive hover:text-destructive"
        >
          <IconTrash className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>

      <AddChiwogModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => setIsEditOpen(false)}
        initialData={chiwog}
      />
    </>
  );
}
