'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconDotsVertical, IconTrash, IconEdit } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deleteNaturalizationType } from '@/actions/common/naturalization-type-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddNaturalizationTypeModal } from './add-naturalization-type-modal';

interface NaturalizationType {
  id: string;
  name: string;
}

export const columns: ColumnDef<NaturalizationType>[] = [
  {
    accessorKey: 'name',
    header: 'Naturalization Type',
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
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const type = row.original;
      return <ActionsCell type={type} />;
    }
  }
];

function ActionsCell({ type }: { type: NaturalizationType }) {
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
      const result = await deleteNaturalizationType(type.id);

      if (!result || !result.error) {
        toast.success('Naturalization type deleted successfully');
        setDeleteDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to delete naturalization type');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete naturalization type error:', error);
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
        title={`Delete "${type.name}"`}
        description="Are you sure you want to delete this naturalization type? This action cannot be undone."
        confirmText="Delete Type"
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

      <AddNaturalizationTypeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => {
          router.refresh();
          setIsEditOpen(false);
        }}
        initialData={type}
      />
    </>
  );
}
