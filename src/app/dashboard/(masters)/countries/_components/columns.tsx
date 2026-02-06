'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { toast } from 'sonner';
import { useState } from 'react';
import { EditCountryModal } from './edit-country-modal';
import { deleteCountry } from '@/actions/common/country-actions';

export interface Country {
  id: string;
  name: string;
  nationality: string;
  isActive?: boolean;
}

interface CreateColumnsProps {
  onRefresh?: () => void;
}

export function createColumns({
  onRefresh
}: CreateColumnsProps = {}): ColumnDef<Country>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Country Name',
      cell: ({ row }) => {
        const country = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
              {country.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{country.name}</div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'nationality',
      header: 'Nationality',
      cell: ({ row }) => {
        return (
          <span className="text-muted-foreground text-sm">
            {row.getValue('nationality')}
          </span>
        );
      }
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const country = row.original;
        return <ActionsCell country={country} onRefresh={onRefresh} />;
      }
    }
  ];
}

function ActionsCell({
  country,
  onRefresh
}: {
  country: Country;
  onRefresh?: () => void;
}) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCountry(country.id);

      if (result.success) {
        toast.success(result.message || 'Country deleted successfully');
        setDeleteDialogOpen(false);
        if (onRefresh) {
          onRefresh();
        } else {
          window.location.reload();
        }
      } else {
        toast.error(result.error || 'Failed to delete country');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
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
        title={`Delete "${country.name}"`}
        description="Are you sure you want to delete this country? This action cannot be undone."
        confirmText="Delete Country"
      />
      <EditCountryModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        country={country}
        onSuccess={() => {
          if (onRefresh) {
            onRefresh();
          } else {
            window.location.reload();
          }
        }}
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditModalOpen(true)}
          className="h-8 w-8"
        >
          <IconEdit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="text-destructive hover:text-destructive h-8 w-8"
        >
          <IconTrash className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </>
  );
}
