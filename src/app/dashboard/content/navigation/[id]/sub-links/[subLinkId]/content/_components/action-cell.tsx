'use client';

import { useState } from 'react';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { CmsPage, deleteCmsPage } from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ActionCellProps {
  data: CmsPage;
}

export function ActionCell({ data }: ActionCellProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
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

      <div className="flex items-center gap-2">
        <Link href={`/dashboard/content/pages/${data.id}`}>
          <Button variant="ghost" size="icon" title="View">
            <IconEye className="h-4 w-4" />
          </Button>
        </Link>
        <Link href={`/dashboard/content/pages/${data.id}/edit`}>
          <Button variant="ghost" size="icon" title="Edit">
            <IconEdit className="h-4 w-4" />
          </Button>
        </Link>
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
