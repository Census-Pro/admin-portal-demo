'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { AddVillageModal } from './add-village-modal';

export default function AddVillageButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <IconPlus className="mr-2 h-4 w-4" />
        Add New Village
      </Button>
      <AddVillageModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
