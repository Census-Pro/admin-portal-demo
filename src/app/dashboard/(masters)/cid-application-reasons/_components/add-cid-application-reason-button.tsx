'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { AddCidApplicationReasonModal } from './add-cid-application-reason-modal';

export function AddCidApplicationReasonButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm">
        <IconPlus className="mr-2 h-4 w-4" />
        Add CID Application Reason
      </Button>
      <AddCidApplicationReasonModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
