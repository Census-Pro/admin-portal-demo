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
import { deleteGender } from '@/actions/common/gender-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddGenderModal } from './add-gender-modal';

interface Gender {
  id: string;
  name: string;
}

export const columns: ColumnDef<Gender>[] = [
  {
    accessorKey: 'name',
    header: 'Gender Name',
    cell: ({ row }) => {
      const gender = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {gender.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{gender.name}</div>
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const gender = row.original;
      return <ActionsCell gender={gender} />;
    }
  }
];

function ActionsCell({ gender }: { gender: Gender }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete the gender "${gender.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteGender(gender.id);

      if (!result || !result.error) {
        toast.success('Gender deleted successfully');
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to delete gender');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete gender error:', error);
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

      <AddGenderModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => {
          router.refresh();
          setIsEditOpen(false);
        }}
        initialData={gender}
      />
    </div>
  );
}
