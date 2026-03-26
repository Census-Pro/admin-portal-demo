'use client';

import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { NavigationDialog } from './navigation-dialog';
import { useRouter } from 'next/navigation';
import {
  createNavigationItem,
  createCmsPage,
  NavigationItem,
  CmsPage
} from '@/actions/common/cms-actions';
import { PageDialog } from '../../pages/_components/page-dialog';
import { toast } from 'sonner';

export function AddNavigationButton() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPageModal, setShowPageModal] = useState(false);
  const [createdNavId, setCreatedNavId] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = async (formData: Partial<NavigationItem>) => {
    try {
      const result = await createNavigationItem(formData as any);
      if (result.success) {
        toast.success(result.message, {
          action: {
            label: 'Add Content Page Now',
            onClick: () => {
              setCreatedNavId(result.data.id);
              setShowPageModal(true);
            }
          }
        });
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

  const handleSavePage = async (formData: Partial<CmsPage>) => {
    try {
      if (!createdNavId) return;
      const result = await createCmsPage({
        ...formData,
        cms_navigation_id: createdNavId
      } as any);
      if (result.success) {
        toast.success('Page created and linked successfully');
        setShowPageModal(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to create page');
      }
    } catch (error) {
      toast.error('Error creating page');
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
      <PageDialog
        open={showPageModal}
        onOpenChange={setShowPageModal}
        page={null}
        onSave={handleSavePage}
        preSelectedNavigationId={createdNavId || undefined}
      />
    </>
  );
}
