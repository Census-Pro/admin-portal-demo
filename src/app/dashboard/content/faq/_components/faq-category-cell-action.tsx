'use client';

import { useState } from 'react';
import { IconEdit, IconTrash, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { FaqCategoryDialog } from './faq-category-dialog';
import {
  FaqCategory,
  deleteFaqCategory,
  updateFaqCategory
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';

interface FaqCategoryActionCellProps {
  data: FaqCategory;
}

export function FaqCategoryActionCell({ data }: FaqCategoryActionCellProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      const result = await deleteFaqCategory(data.id);
      if (result.success) {
        toast.success('FAQ category deleted successfully');
        setDeleteOpen(false);
        // Dispatch custom event to trigger data refresh
        const event = new CustomEvent('faqCategoriesChanged');
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
      const newStatus = data.status === 'active' ? 'inactive' : 'active';
      const result = await updateFaqCategory(data.id, { status: newStatus });
      if (result.success) {
        toast.success(
          `FAQ category ${newStatus === 'active' ? 'activated' : 'deactivated'}`
        );
        // Dispatch custom event to trigger data refresh
        const event = new CustomEvent('faqCategoriesChanged');
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
      <FaqCategoryDialog
        isOpen={open}
        onClose={() => {
          setOpen(false);
          // Dispatch custom event to trigger data refresh
          const event = new CustomEvent('faqCategoriesChanged');
          window.dispatchEvent(event);
        }}
        category={data}
      />
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onConfirm}
        isLoading={loading}
        title="Delete FAQ Category"
        description={`Are you sure you want to delete "${data.name}"? All FAQs in this category will need to be reassigned.`}
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
