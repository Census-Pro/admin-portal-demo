'use client';

import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { AnnouncementDialog } from './announcement-dialog';
import { useRouter } from 'next/navigation';
import { createAnnouncement, Announcement } from '@/actions/common/cms-actions';
import { toast } from 'sonner';

export function AddAnnouncementButton() {
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  const handleSave = async (formData: Partial<Announcement>, file?: File) => {
    try {
      const result = await createAnnouncement(formData as any, file);
      if (result.success) {
        toast.success(result.message);
        setShowAddModal(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to create announcement');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('An error occurred while saving');
    }
  };

  return (
    <>
      <Button onClick={() => setShowAddModal(true)}>
        <IconPlus className="mr-2 h-4 w-4" /> Add Notice
      </Button>
      <AnnouncementDialog
        open={showAddModal}
        onOpenChange={setShowAddModal}
        announcement={null}
        onSave={handleSave}
      />
    </>
  );
}
