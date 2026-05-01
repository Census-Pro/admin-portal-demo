'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { resetDeathDemoData } from '@/actions/common/death-registration-actions';
import { toast } from 'sonner';

export function VerifySearchBar() {
  const [isLoading, startTransition] = useTransition();
  const [isResetting, startResetTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const router = useRouter();

  const [searchParams, setSearchParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      q: parseAsString.withDefault('')
    },
    {
      shallow: false,
      history: 'push'
    }
  );

  const handleSearch = (value: string) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debouncing
    timeoutRef.current = setTimeout(() => {
      startTransition(() => {
        // Reset to page 1 when search query changes and trim whitespace
        setSearchParams({
          q: value.trim(),
          page: 1
        });
      });
    }, 300); // 300ms debounce
  };

  const handleReset = () => {
    startResetTransition(async () => {
      await resetDeathDemoData();
      toast.success('Demo data has been reset');
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Search by name or CID..."
        defaultValue={searchParams.q}
        onChange={(e) => handleSearch(e.target.value)}
        className={cn('w-full md:max-w-sm', isLoading && 'animate-pulse')}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        disabled={isResetting}
        className={cn(isResetting && 'animate-pulse')}
      >
        Reset All
      </Button>
    </div>
  );
}
