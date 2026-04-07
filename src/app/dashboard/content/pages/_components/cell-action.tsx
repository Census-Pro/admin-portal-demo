'use client';

import { useState } from 'react';
import { IconEdit, IconTrash, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { PageDialog } from './page-dialog';
import {
  CmsPage,
  updateCmsPage,
  deleteCmsPage,
  toggleCmsPageStatus,
  checkPageNavigationLinks
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

      // First check if the page is linked to navigation
      const linkCheck = await checkPageNavigationLinks(data.id);

      if (
        linkCheck.success &&
        (linkCheck.isLinkedToNavigation || linkCheck.isLinkedToSubLink)
      ) {
        let message = 'This content page is linked to ';
        if (linkCheck.isLinkedToNavigation && linkCheck.isLinkedToSubLink) {
          message += 'both navigation menu and sub-navigation menu';
        } else if (linkCheck.isLinkedToNavigation) {
          message += 'a navigation menu';
        } else {
          message += 'a sub-navigation menu';
        }
        message +=
          ' and cannot be deleted. Please remove it from navigation first.';

        toast.error(message);
        setDeleteOpen(false);
        return;
      }

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
        {/* Status Toggle Button (Power Button) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleStatus}
          title={data.status === 'published' ? 'Power Off' : 'Power On'}
        >
          <IconPower
            className={`h-4 w-4 ${
              data.status === 'published'
                ? 'text-green-600 dark:text-green-400'
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
