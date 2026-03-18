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
import { deleteNaturalizationType } from '@/actions/common/naturalization-type-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddNaturalizationTypeModal } from './add-naturalization-type-modal';

interface NaturalizationType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateColumnsProps {
  onUpdate?: (item: NaturalizationType) => void;
  onDelete?: (id: string) => void;
  onCreate?: () => void;
}

export function createColumns({
  onUpdate,
  onDelete,
  onCreate
}: CreateColumnsProps): ColumnDef<NaturalizationType>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-3 h-8 gap-1"
        >
          Naturalization Type
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
              {type.name.charAt(0).toUpperCase()}
            </div>
            <div className="font-medium">{type.name}</div>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const type = row.original;
        return (
          <ActionsCell type={type} onUpdate={onUpdate} onDelete={onDelete} />
        );
      }
    }
  ];
}

function ActionsCell({
  type,
  onUpdate,
  onDelete
}: {
  type: NaturalizationType;
  onUpdate?: (item: NaturalizationType) => void;
  onDelete?: (id: string) => void;
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
      const result = await deleteNaturalizationType(type.id);

      if (!result || !result.error) {
        toast.success('Naturalization type deleted successfully');
        setDeleteDialogOpen(false);
        // Instant update
        if (onDelete) {
          onDelete(type.id);
        }
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

  const handleUpdateSuccess = (updatedItem: NaturalizationType) => {
    if (onUpdate) {
      onUpdate(updatedItem);
    }
    setIsEditOpen(false);
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

      <AddNaturalizationTypeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleUpdateSuccess}
        initialData={type}
      />
    </>
  );
}
