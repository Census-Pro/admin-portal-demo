'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deleteVillage } from '@/actions/common/village-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddVillageModal } from './add-village-modal';

interface Village {
  id: string;
  name: string;
  dzongkha_name?: string;
  gewog_id?: string;
  dzongkhag_id?: string;
  chiwog_id?: string;
  gewog?: {
    id: string;
    name: string;
    dzongkha_name?: string;
  };
  dzongkhag?: {
    id: string;
    name: string;
    dzongkha_name?: string;
  };
  chiwog?: {
    id: string;
    name: string;
    dzongkha_name?: string;
  };
}

export const columns: ColumnDef<Village>[] = [
  {
    accessorKey: 'name',
    header: 'Village Name',
    cell: ({ row }) => {
      const village = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {village.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{village.name}</div>
        </div>
      );
    }
  },
  {
    accessorKey: 'dzongkha_name',
    header: 'Dzongkha Name',
    cell: ({ row }) => {
      const village = row.original;
      return <div className="font-medium">{village.dzongkha_name || '-'}</div>;
    }
  },
  {
    accessorKey: 'dzongkhag.name',
    header: 'Dzongkhag',
    cell: ({ row }) => {
      const village = row.original;
      return <div>{village.dzongkhag?.name || 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'gewog.name',
    header: 'Gewog',
    cell: ({ row }) => {
      const village = row.original;
      return <div>{village.gewog?.name || 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'chiwog.name',
    header: 'Chiwog',
    cell: ({ row }) => {
      const village = row.original;
      return <div>{village.chiwog?.name || 'N/A'}</div>;
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const village = row.original;
      return <ActionsCell village={village} />;
    }
  }
];

function ActionsCell({ village }: { village: Village }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteVillage(village.id);

      if (result && !result.error) {
        toast.success('Village deleted successfully');
        setDeleteDialogOpen(false);
      } else {
        toast.error(result?.message || 'Failed to delete village');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete village error:', error);
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
        title={`Delete "${village.name}"`}
        description="Are you sure you want to delete this village? This action cannot be undone."
        confirmText="Delete Village"
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

      <AddVillageModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => setIsEditOpen(false)}
        initialData={village}
      />
    </>
  );
}
