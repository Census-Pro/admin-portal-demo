'use client';

import { useState } from 'react';
import { IconEdit, IconTrash, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { NavigationDialog } from './navigation-dialog';
import {
  NavigationItem,
  updateNavigationItem,
  deleteNavigationItem
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ActionCellProps {
  data: NavigationItem;
  onStatusChange?: (id: string, newStatus: 'active' | 'inactive') => void;
}

export function ActionCell({ data, onStatusChange }: ActionCellProps) {
  const router = useRouter();

  // Navigation internal dialog states
  const [navDialogOpen, setNavDialogOpen] = useState(false);
  const [deleteNavOpen, setDeleteNavOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  // --- Navigation Mutation Handlers ---

  const handleToggleStatus = async () => {
    const newStatus = data.status === 'active' ? 'inactive' : 'active';
    // Optimistically update local state immediately (no row jump)
    onStatusChange?.(data.id, newStatus);
    try {
      const result = await updateNavigationItem(data.id, { status: newStatus });
      if (result.success) {
        toast.success(`Menu item status updated to ${newStatus}`);
      } else {
        // Revert on failure
        onStatusChange?.(data.id, data.status);
        toast.error(result.error);
      }
    } catch (error) {
      onStatusChange?.(data.id, data.status);
      toast.error('Error updating status');
    }
  };

  const onUpdateNav = async (formData: Partial<NavigationItem>) => {
    try {
      const result = await updateNavigationItem(data.id, formData);
      if (result.success) {
        toast.success(result.message);
        setNavDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error updating navigation item');
    }
  };

  const onDeleteNav = async () => {
    setLoading(true);
    try {
      const result = await deleteNavigationItem(data.id);
      if (result.success) {
        toast.success(result.message);
        setDeleteNavOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error deleting navigation item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavigationDialog
        open={navDialogOpen}
        onOpenChange={setNavDialogOpen}
        item={data}
        onSave={onUpdateNav}
      />
      <DeleteConfirmationDialog
        open={deleteNavOpen}
        onOpenChange={setDeleteNavOpen}
        onConfirm={onDeleteNav}
        isLoading={loading}
        title="Delete Menu Item"
        description="Are you sure you want to delete this menu item? This action cannot be undone."
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
          onClick={() => setNavDialogOpen(true)}
          title="Edit"
        >
          <IconEdit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteNavOpen(true)}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          title="Delete"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
