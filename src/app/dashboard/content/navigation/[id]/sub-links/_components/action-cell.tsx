'use client';

import { useState } from 'react';
import { IconEdit, IconTrash, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { SubLinkDialog } from './sub-link-dialog';
import {
  SubLink,
  updateSubLink,
  deleteSubLink
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ActionCellProps {
  data: SubLink;
}

export function ActionCell({ data }: ActionCellProps) {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    try {
      const newStatus = data.status === 'active' ? 'inactive' : 'active';
      const result = await updateSubLink(data.id, { status: newStatus });
      if (result.success) {
        toast.success(`Sub-link status updated to ${newStatus}`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const onUpdate = async (formData: Partial<SubLink>) => {
    try {
      const result = await updateSubLink(data.id, formData);
      if (result.success) {
        toast.success(result.message);
        setDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error updating sub-link');
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteSubLink(data.id);
      if (result.success) {
        toast.success(result.message);
        setDeleteOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error deleting sub-link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SubLinkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={data}
        navigationId={data.cms_navigation_id}
        onSave={onUpdate}
      />
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onDelete}
        isLoading={loading}
        title="Delete Sub-Link"
        description="Are you sure you want to delete this sub-link? All content pages under this sub-link will be unlinked."
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
          onClick={() => setDialogOpen(true)}
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
