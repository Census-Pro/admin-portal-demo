'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { AddRelationshipModal } from './add-relationship-modal';

interface AddRelationshipButtonProps {
  onSuccess?: () => void;
}

export function AddRelationshipButton({
  onSuccess
}: AddRelationshipButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <IconPlus className="mr-2 h-4 w-4" />
        Add Relationship
      </Button>
      <AddRelationshipModal
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
