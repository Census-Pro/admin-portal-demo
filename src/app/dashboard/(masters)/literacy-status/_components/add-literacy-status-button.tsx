'use client';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { AddLiteracyStatusModal } from './add-literacy-status-modal';

export function AddLiteracyStatusButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    // Dispatch custom event to notify table to refresh
    window.dispatchEvent(new Event('literacy-status-created'));
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <IconPlus className="mr-2 h-4 w-4" />
        Add Literacy Status
      </Button>

      <AddLiteracyStatusModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
