'use client';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { AddRegularizationTypeModal } from './add-regularization-type-modal';

export function AddRegularizationTypeButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = (result: any) => {
    if (result) {
      window.dispatchEvent(
        new CustomEvent('regularization-type-created', { detail: result })
      );
    }
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <IconPlus className="mr-2 h-4 w-4" />
        Add Regularization Type
      </Button>

      <AddRegularizationTypeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
