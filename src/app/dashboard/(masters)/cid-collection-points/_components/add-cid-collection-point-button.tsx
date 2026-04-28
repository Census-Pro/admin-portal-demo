'use client';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { AddCidCollectionPointModal } from './add-cid-collection-point-modal';

interface AddCidCollectionPointButtonProps {
  onSuccess?: () => void;
}

export function AddCidCollectionPointButton({
  onSuccess
}: AddCidCollectionPointButtonProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <IconPlus className="mr-2 h-4 w-4" />
        Add Collection Point
      </Button>

      <AddCidCollectionPointModal
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
