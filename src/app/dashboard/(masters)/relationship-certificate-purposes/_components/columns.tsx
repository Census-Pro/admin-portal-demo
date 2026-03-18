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
import { deleteRelationshipCertificatePurpose } from '@/actions/common/relationship-certificate-purpose-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddRelationshipCertificatePurposeModal } from './add-relationship-certificate-purpose-modal';

interface RelationshipCertificatePurpose {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const createColumns = (
  onUpdate: (id: string, updatedItem: RelationshipCertificatePurpose) => void,
  onDelete: (id: string) => void
): ColumnDef<RelationshipCertificatePurpose>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 gap-1"
      >
        Certificate Purpose
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
    header: 'Actions',
    cell: ({ row }) => {
      const purpose = row.original;
      return (
        <ActionsCell
          purpose={purpose}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      );
    }
  }
];

function ActionsCell({
  purpose,
  onUpdate,
  onDelete
}: {
  purpose: RelationshipCertificatePurpose;
  onUpdate: (id: string, updatedItem: RelationshipCertificatePurpose) => void;
  onDelete: (id: string) => void;
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
      const result = await deleteRelationshipCertificatePurpose(purpose.id);

      if (!result || !result.error) {
        toast.success('Certificate purpose deleted successfully');
        onDelete(purpose.id);
        setDeleteDialogOpen(false);
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

      <AddRelationshipCertificatePurposeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(updatedItem) => {
          if (updatedItem) {
            onUpdate(purpose.id, updatedItem);
          }
          setIsEditOpen(false);
        }}
        initialData={purpose}
      />
    </>
  );
}
