'use client';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { AddRelationshipCertificatePurposeModal } from './add-relationship-certificate-purpose-modal';

export function AddRelationshipCertificatePurposeButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <IconPlus className="mr-2 h-4 w-4" />
        Add Certificate Purpose
      </Button>

      <AddRelationshipCertificatePurposeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
}
