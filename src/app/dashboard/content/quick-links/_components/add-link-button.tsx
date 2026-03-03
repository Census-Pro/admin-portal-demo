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
      <Button
        size="lg"
        className="bg-primary hover:bg-primary/90 rounded-xl px-8 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        onClick={() => setShowAddModal(true)}
      >
        <Icons.add className="mr-2 h-5 w-5" />
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
