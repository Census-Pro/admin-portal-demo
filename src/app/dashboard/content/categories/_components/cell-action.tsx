'use client';

import { useState } from 'react';
import { IconEdit, IconTrash, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { CategoryDialog } from './category-dialog';
import {
  AnnouncementCategory,
  updateAnnouncementCategory,
  deleteAnnouncementCategory
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ActionCellProps {
  data: AnnouncementCategory;
}

export function ActionCell({ data }: ActionCellProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      const result = await deleteAnnouncementCategory(data.id);
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

  const handleUpdate = async (formData: Partial<AnnouncementCategory>) => {
    try {
      const result = await updateAnnouncementCategory(data.id, formData);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleToggleStatus = async () => {
    try {
      const result = await updateAnnouncementCategory(data.id, {
        is_active: !data.is_active
      });
      if (result.success) {
        toast.success(
          `Category ${!data.is_active ? 'activated' : 'deactivated'} successfully`
        );
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <>
      <CategoryDialog
        open={open}
        onOpenChange={setOpen}
        category={data}
        onSave={handleUpdate}
      />
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onConfirm}
        isLoading={loading}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
      />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleToggleStatus}
          title={data.is_active ? 'Deactivate' : 'Activate'}
        >
          <IconPower
            className={`h-4 w-4 ${
              data.is_active ? 'text-green-600' : 'text-muted-foreground'
            }`}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setOpen(true)}
          title="Edit"
        >
          <Icons.edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
          onClick={() => setDeleteOpen(true)}
          title="Delete"
        >
          <Icons.trash className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
