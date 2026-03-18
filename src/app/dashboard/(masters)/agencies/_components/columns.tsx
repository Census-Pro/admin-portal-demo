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
import { deleteAgency } from '@/actions/common/agency-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { EditAgencyModal } from './edit-agency-modal';

interface Agency {
  id: string;
  name: string;
  code?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const columns = (onDataChange?: () => void): ColumnDef<Agency>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 gap-1"
      >
        Agency Name
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
      const agency = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {agency.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{agency.name}</div>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground font-mono text-sm">
          {row.getValue('code') || 'No code'}
        </span>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const agency = row.original;
      return <ActionsCell agency={agency} onDataChange={onDataChange} />;
    }
  }
];

function ActionsCell({
  agency,
  onDataChange
}: {
  agency: Agency;
  onDataChange?: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAgency(agency.id);

      if (result.success) {
        toast.success(result.message || 'Agency deleted successfully');
        setDeleteDialogOpen(false);
        onDataChange?.();
      } else {
        toast.error(result.error || 'Failed to delete agency');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete agency error:', error);
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
        title={`Delete "${agency.name}"`}
        description="Are you sure you want to delete this agency? This action cannot be undone."
        confirmText="Delete Agency"
      />
      <EditAgencyModal
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSuccess={() => {
          onDataChange?.();
          setEditDialogOpen(false);
        }}
        agency={agency}
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
