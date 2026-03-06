'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { SubLinkDialog } from './sub-link-dialog';
import { SubLink, createSubLink } from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AddSubLinkButtonProps {
  navigationId: string;
}

export function AddSubLinkButton({ navigationId }: AddSubLinkButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleCreate = async (data: Partial<SubLink>) => {
    try {
      const result = await createSubLink({
        ...data,
        cms_navigation_id: navigationId,
        status: data.status || 'active',
        order: data.order || 0
      } as Omit<SubLink, 'id'>);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error creating sub-link');
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <IconPlus className="mr-2 h-4 w-4" />
        Add Sub-Link
      </Button>
      <SubLinkDialog
        open={open}
        onOpenChange={setOpen}
        navigationId={navigationId}
        onSave={handleCreate}
      />
    </>
  );
}
