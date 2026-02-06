'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deleteDzongkhag } from '@/actions/common/dzongkhag-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddDzongkhagModal } from './add-dzongkhag-modal';

interface Dzongkhag {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const createColumns = (
  onUpdate: (id: string, updatedItem: Dzongkhag) => void,
  onDelete: (id: string) => void
): ColumnDef<Dzongkhag>[] => [
  {
    accessorKey: 'name',
    header: 'Dzongkhag Name',
    cell: ({ row }) => {
      const dzongkhag = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {dzongkhag.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{dzongkhag.name}</div>
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const dzongkhag = row.original;
      return (
        <ActionsCell
          dzongkhag={dzongkhag}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      );
    }
  }
];

function ActionsCell({
  dzongkhag,
  onUpdate,
  onDelete
}: {
  dzongkhag: Dzongkhag;
  onUpdate: (id: string, updatedItem: Dzongkhag) => void;
  onDelete: (id: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteDzongkhag(dzongkhag.id);

      if (!result || !result.error) {
        toast.success('Dzongkhag deleted successfully');
        onDelete(dzongkhag.id);
        setDeleteDialogOpen(false);
      } else {
        toast.error(result.message || 'Failed to delete dzongkhag');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete dzongkhag error:', error);
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
        title={`Delete "${dzongkhag.name}"`}
        description="Are you sure you want to delete this dzongkhag? This action cannot be undone."
        confirmText="Delete Dzongkhag"
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

      <AddDzongkhagModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(updatedItem) => {
          if (updatedItem) {
            onUpdate(dzongkhag.id, updatedItem);
          }
          setIsEditOpen(false);
        }}
        initialData={dzongkhag}
      />
    </>
  );
}
