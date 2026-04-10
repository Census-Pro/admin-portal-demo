'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { AddPaymentServiceTypeModal } from './add-payment-service-type-modal';
import { useRouter } from 'next/navigation';

export function AddPaymentServiceTypeButton() {
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
        Add Payment Service Type
      </Button>
      <AddPaymentServiceTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
