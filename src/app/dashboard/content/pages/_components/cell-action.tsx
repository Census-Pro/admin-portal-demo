'use client';

import { useState } from 'react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { PageDialog } from './page-dialog';
import {
  CmsPage,
  updateCmsPage,
  deleteCmsPage,
  toggleCmsPageStatus
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ActionCellProps {
  data: CmsPage;
}

export function ActionCell({ data }: ActionCellProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      const result = await deleteCmsPage(data.id);
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

  const handleUpdate = async (formData: Partial<CmsPage>) => {
    try {
      const result = await updateCmsPage(data.id, formData);
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
    try {
      const result = await toggleCmsPageStatus(
        data.id,
        data.status as 'draft' | 'published'
      );
      if (result.success) {
        toast.success(result.message);
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
      <PageDialog
        open={open}
        onOpenChange={setOpen}
        page={data}
        onSave={handleUpdate}
      />
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onConfirm}
        isLoading={loading}
        title="Delete Page"
        description="Are you sure you want to delete this page? This action cannot be undone."
      />
      <div className="flex items-center gap-3">
        {/* Visible Publish/Draft toggle */}
        <div className="flex items-center gap-1.5">
          <Switch
            id={`status-${data.id}`}
            checked={data.status === 'published'}
            onCheckedChange={handleToggleStatus}
            className="scale-90"
            aria-label={
              data.status === 'published' ? 'Set to draft' : 'Publish page'
            }
          />
          <Label
            htmlFor={`status-${data.id}`}
            className={`cursor-pointer text-xs font-medium ${
              data.status === 'published'
                ? 'text-green-600 dark:text-green-400'
                : 'text-muted-foreground'
            }`}
          >
            {data.status === 'published' ? 'Published' : 'Draft'}
          </Label>
        </div>

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
