'use client';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { AddCountryModal } from './add-country-modal';

export function AddCountryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <IconPlus className="h-4 w-4" />
        Add Country
      </Button>
      <AddCountryModal
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => window.location.reload()}
      />
    </>
  );
}
