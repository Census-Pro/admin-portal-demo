'use client';

import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { QuickLinkDialog } from './quick-link-dialog';
import { useRouter } from 'next/navigation';

export function AddQuickLinkButton() {
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
        Add Quick Link
      </Button>
      <QuickLinkDialog
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        quickLink={null}
        onSave={handleSave}
      />
    </>
  );
}
