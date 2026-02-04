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
import { deleteGewog } from '@/actions/common/gewog-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddGewogModal } from './add-gewog-modal';

interface Gewog {
  id: string;
  name: string;
}

export const columns: ColumnDef<Gewog>[] = [
  {
    accessorKey: 'name',
    header: 'Gewog Name',
    cell: ({ row }) => {
      const gewog = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {gewog.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{gewog.name}</div>
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const gewog = row.original;
      return <ActionsCell gewog={gewog} />;
    }
  }
];

function ActionsCell({ gewog }: { gewog: Gewog }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete the gewog "${gewog.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteGewog(gewog.id);

      if (!result || !result.error) {
        toast.success('Gewog deleted successfully');
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to delete gewog');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete gewog error:', error);
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

      <AddGewogModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => {
          router.refresh();
          setIsEditOpen(false);
        }}
        initialData={gewog}
      />
    </div>
  );
}
