'use client';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { AddHohChangeReasonModal } from './add-hoh-change-reason-modal';

export function AddHohChangeReasonButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = (result: any) => {
    if (result) {
      window.dispatchEvent(
        new CustomEvent('hoh-change-reason-created', { detail: result })
      );
    }
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <IconPlus className="mr-2 h-4 w-4" />
        Add HOH Change Reason
      </Button>

      <AddHohChangeReasonModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
