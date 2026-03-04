'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { AddVillageModal } from './add-village-modal';
import { useRouter } from 'next/navigation';
import { BulkUploadButton } from '@/components/common/bulk-upload-button';

export default function AddVillageButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <BulkUploadButton itemName="villages" />
        <Button onClick={() => setIsOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Add New Village
        </Button>
      </div>
      <AddVillageModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
