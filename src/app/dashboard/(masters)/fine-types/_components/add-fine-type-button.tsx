'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { AddFineTypeModal } from './add-fine-type-modal';
import { useRouter } from 'next/navigation';

export function AddFineTypeButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setIsModalOpen(false);
    router.refresh();
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} size="sm">
        <IconPlus className="mr-2 h-4 w-4" />
        Add Fine Type
      </Button>
      <AddFineTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
