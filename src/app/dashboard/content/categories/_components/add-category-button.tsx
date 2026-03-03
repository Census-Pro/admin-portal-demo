'use client';

import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { CategoryDialog } from './category-dialog';
import { useRouter } from 'next/navigation';
import {
  createAnnouncementCategory,
  AnnouncementCategory
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';

export function AddCategoryButton() {
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  const handleSave = async (data: Partial<AnnouncementCategory>) => {
    try {
      const result = await createAnnouncementCategory(data as any);
      if (result.success) {
        toast.success(result.message);
        setShowAddModal(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('An error occurred');
    }
  };

  return (
    <>
      <Button onClick={() => setShowAddModal(true)}>
        <IconPlus className="mr-2 h-4 w-4" /> Add Category
      </Button>
      <CategoryDialog
        open={showAddModal}
        onOpenChange={setShowAddModal}
        category={null}
        onSave={handleSave}
      />
    </>
  );
}
