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
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deleteRelationshipCertificatePurpose } from '@/actions/common/relationship-certificate-purpose-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddRelationshipCertificatePurposeModal } from './add-relationship-certificate-purpose-modal';

interface RelationshipCertificatePurpose {
  id: string;
  name: string;
}

export const columns: ColumnDef<RelationshipCertificatePurpose>[] = [
  {
    accessorKey: 'name',
    header: 'Certificate Purpose',
    cell: ({ row }) => {
      const purpose = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {purpose.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{purpose.name}</div>
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const purpose = row.original;
      return <ActionsCell purpose={purpose} />;
    }
  }
];

function ActionsCell({ purpose }: { purpose: RelationshipCertificatePurpose }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteRelationshipCertificatePurpose(purpose.id);

      if (!result || !result.error) {
        toast.success('Certificate purpose deleted successfully');
        setDeleteDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to delete certificate purpose');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete certificate purpose error:', error);
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
        title={`Delete "${purpose.name}"`}
        description="Are you sure you want to delete this certificate purpose? This action cannot be undone."
        confirmText="Delete Purpose"
      />
      <div className="flex justify-end gap-2">
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

      <AddRelationshipCertificatePurposeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => {
          router.refresh();
          setIsEditOpen(false);
        }}
        initialData={purpose}
      />
    </>
  );
}
