'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { PageDialog } from '@/app/dashboard/content/pages/_components/page-dialog';
import { createCmsPage } from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AddContentPageButtonProps {
  navigationId: string;
  subLinkId: string;
}

export function AddContentPageButton({
  navigationId,
  subLinkId
}: AddContentPageButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleCreate = async (data: any) => {
    try {
      const result = await createCmsPage({
        ...data,
        cms_navigation_id: navigationId,
        cm_sub_link_id: subLinkId,
        status: data.status || 'draft'
      });

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error creating content page');
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <IconPlus className="mr-2 h-4 w-4" />
        Add Content Page
      </Button>
      <PageDialog
        open={open}
        onOpenChange={setOpen}
        navigationId={navigationId}
        subLinkId={subLinkId}
        onSave={handleCreate}
      />
    </>
  );
}
