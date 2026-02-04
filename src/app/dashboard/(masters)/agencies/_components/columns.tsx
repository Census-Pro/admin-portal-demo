'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deleteAgency } from '@/actions/common/agency-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Agency {
  id: string;
  name: string;
  code?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const columns: ColumnDef<Agency>[] = [
  {
    accessorKey: 'name',
    header: 'Agency Name',
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
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive');
      return (
        <Badge variant={isActive !== false ? 'default' : 'secondary'}>
          {isActive !== false ? 'Active' : 'Inactive'}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const agency = row.original;
      return <ActionsCell agency={agency} />;
    }
  }
];

function ActionsCell({ agency }: { agency: Agency }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAgency(agency.id);

      if (result.success) {
        toast.success(result.message || 'Agency deleted successfully');
        setDeleteDialogOpen(false);
        router.refresh();
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
      <div className="flex justify-end gap-2">
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
