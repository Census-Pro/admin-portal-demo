'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';

export function BackButton() {
  const router = useRouter();

  return (
    <Button variant="ghost" onClick={() => router.back()} className="mb-4">
      <IconArrowLeft className="mr-2 h-4 w-4" />
      Back to List
    </Button>
  );
}
