'use client';

import { useState } from 'react';
import { IconEdit, IconTrash, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { QuickLinkCategoryDialog } from './category-dialog';
import {
  QuickLinkCategory,
  deleteQuickLinkCategory,
  toggleQuickLinkCategoryStatus
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';

interface ActionCellProps {
  data: QuickLinkCategory;
}

export function ActionCell({ data }: ActionCellProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      const result = await deleteQuickLinkCategory(data.id);
      if (result.success) {
        toast.success(result.message);
        setDeleteOpen(false);
        // Dispatch custom event to trigger data refresh
        const event = new CustomEvent('categoriesChanged');
        window.dispatchEvent(event);
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
      const result = await toggleQuickLinkCategoryStatus(data.id);
      if (result.success) {
        toast.success('Status updated successfully');
        // Dispatch custom event to trigger data refresh
        const event = new CustomEvent('categoriesChanged');
        window.dispatchEvent(event);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  return (
    <>
      <QuickLinkCategoryDialog
        open={open}
        onClose={() => setOpen(false)}
        category={data}
        onSave={() => {
          setOpen(false);
          // Dispatch custom event to trigger data refresh
          const event = new CustomEvent('categoriesChanged');
          window.dispatchEvent(event);
        }}
      />
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onConfirm}
        isLoading={loading}
        title="Delete Category"
        description={`Are you sure you want to delete "${data.name}"? All quick links in this category will need to be reassigned.`}
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
