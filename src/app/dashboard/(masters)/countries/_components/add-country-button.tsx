'use client';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { AddCountryModal } from './add-country-modal';

import { BulkUploadButton } from '@/components/common/bulk-upload-button';

export function AddCountryButton() {
  const [open, setOpen] = useState(false);

  const handleSuccess = (result: any) => {
    if (result) {
      window.dispatchEvent(
        new CustomEvent('country-created', { detail: result })
      );
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <BulkUploadButton itemName="countries" />
        <Button onClick={() => setOpen(true)} className="gap-2">
          <IconPlus className="h-4 w-4" />
          Add Country
        </Button>
      </div>
      <AddCountryModal
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
