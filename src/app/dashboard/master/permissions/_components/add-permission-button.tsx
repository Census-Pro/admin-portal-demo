'use client';

import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { AddPermissionModal } from './add-permission-modal';
import { useRouter } from 'next/navigation';

export function AddPermissionButton() {
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
  const router = useRouter();

  const handlePermissionCreated = () => {
    router.refresh(); // Refresh the server component data
  };

  return (
    <>
      <Button onClick={() => setShowAddPermissionModal(true)}>
        <IconPlus className="mr-2 h-4 w-4" /> Add Permission
      </Button>
      <AddPermissionModal
        isOpen={showAddPermissionModal}
        onClose={() => setShowAddPermissionModal(false)}
        onSuccess={handlePermissionCreated}
      />
    </>
  );
}
