'use client';

import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { MediaDialog } from './media-dialog';
import { useRouter } from 'next/navigation';
import { uploadMediaFile, MediaItem } from '@/actions/common/cms-actions';
import { toast } from 'sonner';

export function AddMediaButton() {
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  const handleSave = async (
    formData: FormData | Partial<MediaItem>,
    file?: File
  ) => {
    try {
      if (formData instanceof FormData) {
        const result = await uploadMediaFile(formData);
        if (result.success) {
          toast.success(result.message);
          setShowAddModal(false);
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to upload media');
        }
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('An error occurred while uploading');
    }
  };

  return (
    <>
      <Button onClick={() => setShowAddModal(true)}>
        <Icons.add className="mr-2 h-4 w-4" /> Upload Media
      </Button>
      <MediaDialog
        open={showAddModal}
        onOpenChange={setShowAddModal}
        media={null}
        onSave={handleSave}
      />
    </>
  );
}
