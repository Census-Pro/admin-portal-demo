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
import { deleteLiteracyStatus } from '@/actions/common/literacy-status-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddLiteracyStatusModal } from './add-literacy-status-modal';

interface LiteracyStatus {
  id: string;
  name: string;
}

export const columns: ColumnDef<LiteracyStatus>[] = [
  {
    accessorKey: 'name',
    header: 'Literacy Status Name',
    cell: ({ row }) => {
      const literacyStatus = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {literacyStatus.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{literacyStatus.name}</div>
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const literacyStatus = row.original;
      return <ActionsCell literacyStatus={literacyStatus} />;
    }
  }
];

function ActionsCell({ literacyStatus }: { literacyStatus: LiteracyStatus }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete the literacy status "${literacyStatus.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteLiteracyStatus(literacyStatus.id);

      if (!result || !result.error) {
        toast.success('Literacy status deleted successfully');
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to delete literacy status');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete literacy status error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isDeleting}>
            <IconDotsVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <IconEdit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive focus:text-destructive"
          >
            <IconTrash className="mr-2 h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddLiteracyStatusModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => {
          router.refresh();
          setIsEditOpen(false);
        }}
        initialData={literacyStatus}
      />
    </div>
  );
}
