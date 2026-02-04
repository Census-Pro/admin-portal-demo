'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { AddRelationshipModal } from './add-relationship-modal';
import { useRouter } from 'next/navigation';

export function AddRelationshipButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

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
          router.refresh();
          setIsOpen(false);
        }}
      />
    </>
  );
}
