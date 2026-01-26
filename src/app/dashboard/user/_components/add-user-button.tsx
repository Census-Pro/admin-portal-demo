'use client';

import { useState } from 'react';
import { IconUserPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { AddUserModal } from './add-user-modal';
import { useRouter } from 'next/navigation';

export function AddUserButton() {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const router = useRouter();

  const handleUserCreated = () => {
    router.refresh(); // Refresh the server component data
  };

  return (
    <>
      <Button onClick={() => setShowAddUserModal(true)}>
        <IconUserPlus className="mr-2 h-4 w-4" /> Add User
      </Button>
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSuccess={handleUserCreated}
      />
    </>
  );
}
