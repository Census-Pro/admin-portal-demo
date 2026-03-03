'use client';

import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { NavigationDialog } from './navigation-dialog';
import { useRouter } from 'next/navigation';
import {
  createNavigationItem,
  NavigationItem
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';

export function AddNavigationButton() {
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  const handleSave = async (formData: Partial<NavigationItem>) => {
    try {
      const result = await createNavigationItem(formData as any);
      if (result.success) {
        toast.success(result.message);
        setShowAddModal(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to create navigation item');
      }
    } catch (error) {
      console.error('[AddNavigationButton] Error:', error);
      toast.error('An error occurred while saving');
    }
  };

  return (
    <>
      <Button onClick={() => setShowAddModal(true)}>
        <Icons.add className="mr-2 h-4 w-4" /> Add Nav Link
      </Button>
      <NavigationDialog
        open={showAddModal}
        onOpenChange={setShowAddModal}
        item={null}
        onSave={handleSave}
      />
    </>
  );
}
