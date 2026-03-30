'use client';

import { useState } from 'react';
import { IconEdit, IconTrash, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { OfficeContactDialog } from './office-contact-dialog';
import {
  OfficeContact,
  deleteOfficeContact,
  toggleOfficeContactStatus
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ActionCellProps {
  data: OfficeContact;
}

export function ActionCell({ data }: ActionCellProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      const result = await deleteOfficeContact(data.id);
      if (result.success) {
        toast.success(result.message);
        setDeleteOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    try {
      const result = await toggleOfficeContactStatus(data.id);
      if (result.success) {
        toast.success(
          `Office contact ${!data.isActive ? 'activated' : 'deactivated'}`
        );
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  return (
    <>
      <OfficeContactDialog
        open={open}
        onClose={() => setOpen(false)}
        officeContact={data}
        onSave={() => {
          setOpen(false);
          router.refresh();
        }}
      />
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onConfirm}
        isLoading={loading}
        title="Delete Office Contact"
        description={`Are you sure you want to delete "${data.name}"? This action cannot be undone.`}
      />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setOpen(true)}
          title="Edit"
        >
          <IconEdit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleToggleActive}
          title={data.isActive ? 'Deactivate' : 'Activate'}
        >
          <IconPower
            className={`h-4 w-4 ${
              data.isActive ? 'text-green-600' : 'text-muted-foreground'
            }`}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
          onClick={() => setDeleteOpen(true)}
          title="Delete"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
