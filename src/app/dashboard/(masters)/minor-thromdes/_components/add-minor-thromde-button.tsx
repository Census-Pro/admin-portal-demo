'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { AddMinorThromdeModal } from './add-minor-thromde-modal';

export function AddMinorThromdeButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm">
        <IconPlus className="mr-2 h-4 w-4" />
        Add Minor Thromde
      </Button>
      <AddMinorThromdeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
