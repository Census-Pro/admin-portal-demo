'use client';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { AddGewogModal } from './add-gewog-modal';

import { BulkUploadButton } from '@/components/common/bulk-upload-button';

export function AddGewogButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <BulkUploadButton itemName="gewogs" />
        <Button onClick={() => setIsOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Add Gewog
        </Button>
      </div>

      <AddGewogModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
}
