'use client';

import { useState } from 'react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
      <div className="flex items-center gap-3">
        {/* Visible Active/Inactive toggle */}
        <div className="flex items-center gap-1.5">
          <Switch
            id={`status-${data.id}`}
            checked={data.status === 'active'}
            onCheckedChange={handleToggleStatus}
            className="scale-90"
            aria-label={
              data.status === 'active' ? 'Deactivate notice' : 'Activate notice'
            }
          />
          <Label
            htmlFor={`status-${data.id}`}
            className={`cursor-pointer text-xs font-medium ${
              data.status === 'active'
                ? 'text-green-600 dark:text-green-400'
                : 'text-muted-foreground'
            }`}
          >
            {data.status === 'active' ? 'Active' : 'Inactive'}
          </Label>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label="Edit announcement"
          title="Edit"
        >
          <IconEdit className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteOpen(true)}
          className="text-destructive hover:text-destructive"
          aria-label="Delete announcement"
          title="Delete"
        >
          <IconTrash className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </>
  );
}
