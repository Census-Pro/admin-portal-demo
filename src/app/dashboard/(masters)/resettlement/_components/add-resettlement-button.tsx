'use client';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { AddResettlementModal } from './add-resettlement-modal';

interface AddResettlementButtonProps {
  onSuccess?: () => void;
}

export function AddResettlementButton({
  onSuccess
}: AddResettlementButtonProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <IconPlus className="mr-2 h-4 w-4" />
        Add Resettlement
      </Button>

      <AddResettlementModal
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
