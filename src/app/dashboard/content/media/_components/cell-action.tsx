'use client';

import { useState } from 'react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { MediaDialog } from './media-dialog';
import {
  MediaItem,
  updateMediaFileWithUpload,
  updateMediaItem,
  deleteMediaItem
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ActionCellProps {
  data: MediaItem;
}

export function ActionCell({ data }: ActionCellProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      const result = await deleteMediaItem(data.id);
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

  const handleUpdate = async (
    formData: FormData | Partial<MediaItem>,
    file?: File
  ) => {
    try {
      if (file && formData instanceof FormData) {
        const result = await updateMediaFileWithUpload(data.id, formData);
        if (result.success) {
          toast.success(result.message);
          setOpen(false);
          router.refresh();
        } else {
          toast.error(result.error);
        }
      } else if (formData && !(formData instanceof FormData)) {
        const result = await updateMediaItem(data.id, formData);
        if (result.success) {
          toast.success(result.message);
          setOpen(false);
          router.refresh();
        } else {
          toast.error(result.error);
        }
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    }
  };

  return (
    <>
      <MediaDialog
        open={open}
        onOpenChange={setOpen}
        media={data}
        onSave={handleUpdate}
      />
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onConfirm}
        isLoading={loading}
        title="Delete Media"
        description="Are you sure you want to delete this media file? This action cannot be undone."
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
