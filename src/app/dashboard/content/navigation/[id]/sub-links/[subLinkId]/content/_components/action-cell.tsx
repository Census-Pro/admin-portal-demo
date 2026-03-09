'use client';

import { useState } from 'react';
import { IconEdit, IconTrash, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { PageDialog } from '@/app/dashboard/content/pages/_components/page-dialog';
import {
  CmsPage,
  deleteCmsPage,
  updateCmsPage
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ActionCellProps {
  data: CmsPage;
  onStatusChange?: (id: string, newStatus: 'published' | 'draft') => void;
}

export function ActionCell({ data, onStatusChange }: ActionCellProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteCmsPage(data.id);
      if (result.success) {
        toast.success(result.message);
        setDeleteOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error deleting content page');
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (formData: Partial<CmsPage>) => {
    try {
      const result = await updateCmsPage(data.id, formData);
      if (result.success) {
        toast.success(result.message);
        setEditOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error updating content page');
    }
  };

  const onToggleStatus = async () => {
    const newStatus = data.status === 'published' ? 'draft' : 'published';
    // Optimistically update local state immediately (no row jump)
    onStatusChange?.(data.id, newStatus);
    try {
      const result = await updateCmsPage(data.id, { status: newStatus });
      if (result.success) {
        toast.success(
          `Content page ${newStatus === 'published' ? 'published' : 'unpublished'}`
        );
      } else {
        // Revert on failure
        onStatusChange?.(data.id, data.status as 'published' | 'draft');
        toast.error(result.error);
      }
    } catch (error) {
      onStatusChange?.(data.id, data.status as 'published' | 'draft');
      toast.error('Error updating status');
    }
  };

  return (
    <>
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onDelete}
        isLoading={loading}
        title="Delete Content Page"
        description="Are you sure you want to delete this content page? This action cannot be undone."
      />

      <PageDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        page={data}
        onSave={onUpdate}
      />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleStatus}
          className={
            data.status === 'published'
              ? 'text-green-600 hover:bg-green-50 hover:text-green-700 dark:text-green-500 dark:hover:bg-green-950'
              : 'text-gray-400 hover:bg-gray-50 hover:text-gray-500 dark:text-gray-600 dark:hover:bg-gray-900'
          }
          title={
            data.status === 'published'
              ? 'Published - Click to unpublish'
              : 'Draft - Click to publish'
          }
        >
          <IconPower className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditOpen(true)}
          title="Edit"
        >
          <IconEdit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteOpen(true)}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          title="Delete"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
