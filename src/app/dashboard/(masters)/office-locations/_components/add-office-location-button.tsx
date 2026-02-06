'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { AddOfficeLocationModal } from './add-office-location-modal';

interface AddOfficeLocationButtonProps {
  onSuccess?: () => void;
}

export function AddOfficeLocationButton({
  onSuccess
}: AddOfficeLocationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <IconPlus className="mr-2 h-4 w-4" />
        Add Office Location
      </Button>
      <AddOfficeLocationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          onSuccess?.();
          setIsOpen(false);
        }}
      />
    </>
  );
}
