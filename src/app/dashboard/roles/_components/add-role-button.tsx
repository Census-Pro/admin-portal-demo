'use client';

import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { AddRoleModal } from './add-role-modal';
import { useRouter } from 'next/navigation';

export function AddRoleButton() {
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const router = useRouter();

  const handleRoleCreated = () => {
    router.refresh(); // Refresh the server component data
  };

  return (
    <>
      <Button onClick={() => setShowAddRoleModal(true)}>
        <IconPlus className="mr-2 h-4 w-4" /> Add Role
      </Button>
      <AddRoleModal
        isOpen={showAddRoleModal}
        onClose={() => setShowAddRoleModal(false)}
        onSuccess={handleRoleCreated}
      />
    </>
  );
}
