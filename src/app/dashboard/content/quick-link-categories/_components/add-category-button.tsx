'use client';

import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { QuickLinkCategoryDialog } from './category-dialog';

export function AddCategoryButton() {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSave = () => {
    setShowAddModal(false);
    // Dispatch custom event to trigger data refresh
    const event = new CustomEvent('categoriesChanged');
    window.dispatchEvent(event);
  };

  return (
    <>
      <Button onClick={() => setShowAddModal(true)}>
        <Icons.add className="mr-2 h-4 w-4" />
        Add Category
      </Button>
      <QuickLinkCategoryDialog
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        category={null}
        onSave={handleSave}
      />
    </>
  );
}
