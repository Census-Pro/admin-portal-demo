'use client';

import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { OfficeContactDialog } from './office-contact-dialog';
import { useRouter } from 'next/navigation';

export function AddOfficeContactButton() {
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    setShowAddModal(false);
    router.refresh();
  };

  return (
    <>
      <Button onClick={() => setShowAddModal(true)}>
        <Icons.add className="mr-2 h-4 w-4" />
        Add Office Contact
      </Button>
      <OfficeContactDialog
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        officeContact={null}
        onSave={handleSave}
      />
    </>
  );
}
