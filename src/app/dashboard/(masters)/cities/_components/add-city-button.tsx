'use client';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { AddCityModal } from './add-city-modal';

export function AddCityButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <IconPlus className="mr-2 h-4 w-4" />
        Add City
      </Button>

      <AddCityModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
}
