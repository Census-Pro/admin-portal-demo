'use client';

import { useState } from 'react';
import { IconEdit, IconTrash, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { FaqDialog } from './faq-dialog';
import { Faq, deleteFaq, updateFaq } from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ActionCellProps {
  data: Faq;
}

export function ActionCell({ data }: ActionCellProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      const result = await deleteFaq(data.id);
      if (result.success) {
        toast.success('FAQ deleted successfully');
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

  const handleToggleActive = async () => {
    try {
      const newStatus = data.status === 'active' ? 'inactive' : 'active';
      const result = await updateFaq(data.id, { status: newStatus });
      if (result.success) {
        toast.success(
          `FAQ ${newStatus === 'active' ? 'activated' : 'deactivated'}`
        );
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
      <FaqDialog
        isOpen={open}
        onClose={() => {
          setOpen(false);
          router.refresh();
        }}
        faq={data}
      />
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onConfirm}
        isLoading={loading}
        title="Delete FAQ"
        description={`Are you sure you want to delete "${data.question}"? This action cannot be undone.`}
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
