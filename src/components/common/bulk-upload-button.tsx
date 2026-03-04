'use client';

import { Button } from '@/components/ui/button';
import { IconUpload } from '@tabler/icons-react';
import { toast } from 'sonner';

export function BulkUploadButton({ itemName }: { itemName: string }) {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.info(`Bulk upload for ${itemName} is not yet implemented.`)
      }
    >
      <IconUpload className="mr-2 h-4 w-4" />
      Bulk Upload
    </Button>
  );
}
