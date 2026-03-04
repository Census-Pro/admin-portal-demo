'use client';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { AddDzongkhagModal } from './add-dzongkhag-modal';

import { BulkUploadButton } from '@/components/common/bulk-upload-button';

export function AddDzongkhagButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = (result: any) => {
    if (result) {
      window.dispatchEvent(
        new CustomEvent('dzongkhag-created', { detail: result })
      );
    }
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <BulkUploadButton itemName="dzongkhags" />
        <Button onClick={() => setIsOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Add Dzongkhag
        </Button>
      </div>

      <AddDzongkhagModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
