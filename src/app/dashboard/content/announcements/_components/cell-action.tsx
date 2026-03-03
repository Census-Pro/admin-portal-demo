'use client';

import { useState } from 'react';
import { IconEdit, IconTrash, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { AnnouncementDialog } from './announcement-dialog';
import {
  Announcement,
  updateAnnouncement,
  deleteAnnouncement
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ActionCellProps {
  data: Announcement;
}

export function ActionCell({ data }: ActionCellProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      const result = await deleteAnnouncement(data.id);
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

  const handleUpdate = async (formData: Partial<Announcement>, file?: File) => {
    try {
      const result = await updateAnnouncement(data.id, formData, file);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = data.status === 'active' ? 'inactive' : 'active';
    try {
      const result = await updateAnnouncement(data.id, { status: newStatus });
      if (result.success) {
        toast.success(`Status updated to ${newStatus}`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred while toggling status');
    }
  };

  return (
    <>
      <AnnouncementDialog
        open={open}
        onOpenChange={setOpen}
        announcement={data}
        onSave={handleUpdate}
      />
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onConfirm}
        isLoading={loading}
        title="Delete Notice"
        description="Are you sure you want to delete this notice? This action cannot be undone."
      />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleStatus}
          title={data.status === 'active' ? 'Deactivate' : 'Activate'}
        >
          <IconPower
            className={`h-4 w-4 ${
              data.status === 'active'
                ? 'text-green-600'
                : 'text-muted-foreground'
            }`}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          title="Edit"
        >
          <IconEdit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteOpen(true)}
          className="text-destructive hover:text-destructive"
          title="Delete"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
