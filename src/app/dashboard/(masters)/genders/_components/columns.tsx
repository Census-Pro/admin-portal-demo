'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deleteGender } from '@/actions/common/gender-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddGenderModal } from './add-gender-modal';

interface Gender {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const createColumns = (
  onUpdate: (id: string, updatedItem: Gender) => void,
  onDelete: (id: string) => void
): ColumnDef<Gender>[] => [
  {
    accessorKey: 'name',
    header: 'Gender Name',
    cell: ({ row }) => {
      const gender = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {gender.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{gender.name}</div>
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const gender = row.original;
      return (
        <ActionsCell gender={gender} onUpdate={onUpdate} onDelete={onDelete} />
      );
    }
  }
];

function ActionsCell({
  gender,
  onUpdate,
  onDelete
}: {
  gender: Gender;
  onUpdate: (id: string, updatedItem: Gender) => void;
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
      const result = await deleteGender(gender.id);

      if (!result || !result.error) {
        toast.success('Gender deleted successfully');
        onDelete(gender.id);
        setDeleteDialogOpen(false);
      } else {
        toast.error(result.message || 'Failed to delete gender');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete gender error:', error);
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
        title={`Delete "${gender.name}"`}
        description="Are you sure you want to delete this gender? This action cannot be undone."
        confirmText="Delete Gender"
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

      <AddGenderModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(updatedItem) => {
          if (updatedItem) {
            onUpdate(gender.id, updatedItem);
          }
          setIsEditOpen(false);
        }}
        initialData={gender}
      />
    </>
  );
}
