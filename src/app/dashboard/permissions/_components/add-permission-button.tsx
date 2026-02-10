'use client';

import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { AddPermissionModal } from './add-permission-modal';

interface AddPermissionButtonProps {
  onSuccess?: () => void;
}

export function AddPermissionButton({ onSuccess }: AddPermissionButtonProps) {
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);

  const handlePermissionCreated = () => {
    onSuccess?.(); // Call the refresh callback
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
