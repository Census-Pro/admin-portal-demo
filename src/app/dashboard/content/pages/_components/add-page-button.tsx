'use client';

import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { PageDialog } from './page-dialog';
import { useRouter } from 'next/navigation';
import { createCmsPage, CmsPage } from '@/actions/common/cms-actions';
import { toast } from 'sonner';

export function AddPageButton() {
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  const handleSave = async (formData: Partial<CmsPage>) => {
    try {
      const result = await createCmsPage(formData as any);
      if (result.success) {
        toast.success(result.message);
        setShowAddModal(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to create page');
      }
    } catch (error) {
      console.error('Error creating page:', error);
      toast.error('An error occurred while saving');
    }
  };

  return (
    <>
      <Button onClick={() => setShowAddModal(true)}>
        <IconPlus className="mr-2 h-4 w-4" /> Add Page
      </Button>
      <PageDialog
        open={showAddModal}
        onOpenChange={setShowAddModal}
        page={null}
        onSave={handleSave}
      />
    </>
  );
}
