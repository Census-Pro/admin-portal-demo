'use client';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { AddOperatorModal } from './add-operator-modal';

interface AddOperatorButtonProps {
  onSuccess?: () => void;
}

export function AddOperatorButton({ onSuccess }: AddOperatorButtonProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <IconPlus className="mr-2 h-4 w-4" />
        Add Operator
      </Button>

      <AddOperatorModal
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
