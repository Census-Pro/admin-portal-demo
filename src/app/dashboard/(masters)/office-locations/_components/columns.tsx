'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deleteOfficeLocation } from '@/actions/common/office-location-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { EditOfficeLocationModal } from './edit-office-location-modal';

interface OfficeLocation {
  id: string;
  name: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const columns = (
  onDataChange?: () => void
): ColumnDef<OfficeLocation>[] => [
  {
    accessorKey: 'name',
    header: 'Office Location Name',
    cell: ({ row }) => {
      const location = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {location.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{location.name}</div>
          </div>
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const location = row.original;
      return <ActionsCell location={location} onDataChange={onDataChange} />;
    }
  }
];

function ActionsCell({
  location,
  onDataChange
}: {
  location: OfficeLocation;
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
      const result = await deleteOfficeLocation(location.id);

      if (result.success) {
        toast.success(result.message || 'Office location deleted successfully');
        setDeleteDialogOpen(false);
        onDataChange?.();
      } else {
        toast.error(result.error || 'Failed to delete office location');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete office location error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    onDataChange?.();
  };

  return (
    <>
      <EditOfficeLocationModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        officeLocation={location}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={`Delete "${location.name}"`}
        description="Are you sure you want to delete this office location? This action cannot be undone."
        confirmText="Delete Location"
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
