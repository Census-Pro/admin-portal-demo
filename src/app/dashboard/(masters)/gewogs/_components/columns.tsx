'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deleteGewog } from '@/actions/common/gewog-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddGewogModal } from './add-gewog-modal';

interface Gewog {
  id: string;
  name: string;
}

export const columns: ColumnDef<Gewog>[] = [
  {
    accessorKey: 'name',
    header: 'Gewog Name',
    cell: ({ row }) => {
      const gewog = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {gewog.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{gewog.name}</div>
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const gewog = row.original;
      return <ActionsCell gewog={gewog} />;
    }
  }
];

function ActionsCell({ gewog }: { gewog: Gewog }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteGewog(gewog.id);

      if (!result || !result.error) {
        toast.success('Gewog deleted successfully');
        setDeleteDialogOpen(false);
      } else {
        toast.error(result.message || 'Failed to delete gewog');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete gewog error:', error);
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
        title={`Delete "${gewog.name}"`}
        description="Are you sure you want to delete this gewog? This action cannot be undone."
        confirmText="Delete Gewog"
      />
      <div className="flex justify-end gap-2">
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

      <AddGewogModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => setIsEditOpen(false)}
        initialData={gewog}
      />
    </>
  );
}
