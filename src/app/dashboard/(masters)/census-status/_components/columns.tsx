'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deleteCensusStatus } from '@/actions/common/census-status-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddCensusStatusModal } from './add-census-status-modal';

interface CensusStatus {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateColumnsProps {
  onUpdate?: (item: CensusStatus) => void;
  onDelete?: (id: string) => void;
  onCreate?: () => void;
}

export function createColumns({
  onUpdate,
  onDelete,
  onCreate
}: CreateColumnsProps): ColumnDef<CensusStatus>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Census Status Name',
      cell: ({ row }) => {
        const censusStatus = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
              {censusStatus.name.charAt(0).toUpperCase()}
            </div>
            <div className="font-medium">{censusStatus.name}</div>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const censusStatus = row.original;
        return (
          <ActionsCell
            censusStatus={censusStatus}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        );
      }
    }
  ];
}

function ActionsCell({
  censusStatus,
  onUpdate,
  onDelete
}: {
  censusStatus: CensusStatus;
  onUpdate?: (item: CensusStatus) => void;
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
      const result = await deleteCensusStatus(censusStatus.id);

      if (!result || !result.error) {
        toast.success('Census status deleted successfully');
        setDeleteDialogOpen(false);
        // Instant update
        if (onDelete) {
          onDelete(censusStatus.id);
        }
      } else {
        toast.error(result.message || 'Failed to delete census status');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete census status error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateSuccess = (updatedItem: CensusStatus) => {
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
        title={`Delete "${censusStatus.name}"`}
        description="Are you sure you want to delete this census status? This action cannot be undone."
        confirmText="Delete Status"
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

      <AddCensusStatusModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleUpdateSuccess}
        initialData={censusStatus}
      />
    </>
  );
}
