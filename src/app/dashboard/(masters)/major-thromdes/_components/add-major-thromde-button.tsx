'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { AddMajorThromdeModal } from './add-major-thromde-modal';

export function AddMajorThromdeButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm">
        <IconPlus className="mr-2 h-4 w-4" />
        Add Major Thromde
      </Button>
      <AddMajorThromdeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
