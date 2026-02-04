'use client';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { AddNaturalizationTypeModal } from './add-naturalization-type-modal';

export function AddNaturalizationTypeButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <IconPlus className="mr-2 h-4 w-4" />
        Add Naturalization Type
      </Button>

      <AddNaturalizationTypeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
}
