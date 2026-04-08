'use client';

import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { QuickLinkDialog } from './quick-link-dialog';
export function AddQuickLinkButton() {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSave = () => {
    setShowAddModal(false);
    window.dispatchEvent(new Event('quickLinksChanged'));
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
