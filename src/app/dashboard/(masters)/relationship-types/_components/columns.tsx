'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deleteRelationship } from '@/actions/common/relationship-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { EditRelationshipModal } from './edit-relationship-modal';

interface Relationship {
  id: string;
  name: string;
}

export const columns = (
  onDataChange?: () => void
): ColumnDef<Relationship>[] => [
  {
    accessorKey: 'name',
    header: 'Relationship Name',
    cell: ({ row }) => {
      const relationship = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {relationship.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{relationship.name}</div>
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const relationship = row.original;
      return (
        <ActionsCell relationship={relationship} onDataChange={onDataChange} />
      );
    }
  }
];

function ActionsCell({
  relationship,
  onDataChange
}: {
  relationship: Relationship;
  onDataChange?: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteRelationship(relationship.id);

      if (result.success) {
        toast.success(result.message || 'Relationship deleted successfully');
        setDeleteDialogOpen(false);
        onDataChange?.();
      } else {
        toast.error(result.error || 'Failed to delete relationship');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete relationship error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    onDataChange?.();
  };

  return (
    <>
      <EditRelationshipModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        relationship={relationship}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={`Delete "${relationship.name}"`}
        description="Are you sure you want to delete this relationship? This action cannot be undone."
        confirmText="Delete Relationship"
      />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEditClick}
          className="text-muted-foreground hover:text-foreground"
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
    </>
  );
}
