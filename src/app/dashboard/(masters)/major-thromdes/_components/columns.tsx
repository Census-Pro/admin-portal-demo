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
import { deleteMajorThromde } from '@/actions/common/major-thromde-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddMajorThromdeModal } from './add-major-thromde-modal';

interface MajorThromde {
  id: string;
  name: string;
  dzongkhagId: string;
  dzongkhagName: string;
  isActive: boolean;
}

export const columns: ColumnDef<MajorThromde>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 gap-1"
      >
        Thromde Name
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
      const majorThromde = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {majorThromde.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{majorThromde.name}</div>
        </div>
      );
    }
  },
  {
    accessorKey: 'dzongkhagName',
    header: 'Dzongkhag',
    cell: ({ row }) => {
      const majorThromde = row.original;
      return <div className="font-medium">{majorThromde.dzongkhagName}</div>;
    }
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const majorThromde = row.original;
      return (
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              majorThromde.isActive ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm font-medium">
            {majorThromde.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const majorThromde = row.original;
      return <ActionsCell majorThromde={majorThromde} />;
    }
  }
];

function ActionsCell({ majorThromde }: { majorThromde: MajorThromde }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteMajorThromde(majorThromde.id);

      if (!result || !result.error) {
        toast.success('Major thromde deleted successfully');
        setDeleteDialogOpen(false);
      } else {
        toast.error(result.message || 'Failed to delete major thromde');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete major thromde error:', error);
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
        title={`Delete "${majorThromde.name}"`}
        description="Are you sure you want to delete this major thromde? This action cannot be undone."
      />

      <AddMajorThromdeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditOpen(true)}
          className="hover:bg-accent h-8 w-8"
        >
          <IconEdit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
