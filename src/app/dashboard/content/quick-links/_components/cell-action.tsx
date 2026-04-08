'use client';

import { useState } from 'react';
import { IconEdit, IconTrash, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { QuickLinkDialog } from './quick-link-dialog';
import {
  QuickLink,
  deleteQuickLink,
  toggleQuickLinkStatus
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';

interface ActionCellProps {
  data: QuickLink;
}

export function ActionCell({ data }: ActionCellProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      const result = await deleteQuickLink(data.id);
      if (result.success) {
        toast.success(result.message);
        setDeleteOpen(false);
        window.dispatchEvent(new Event('quickLinksChanged'));
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
      const result = await toggleQuickLinkStatus(data.id);
      if (result.success) {
        toast.success(
          `Quick link ${!data.is_active ? 'activated' : 'deactivated'}`
        );
        window.dispatchEvent(new Event('quickLinksChanged'));
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  return (
    <>
      <QuickLinkDialog
        open={open}
        onClose={() => setOpen(false)}
        quickLink={data}
        onSave={() => {
          setOpen(false);
          window.dispatchEvent(new Event('quickLinksChanged'));
        }}
      />
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onConfirm}
        isLoading={loading}
        title="Delete Quick Link"
        description={`Are you sure you want to delete "${data.title}"? This action cannot be undone.`}
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
