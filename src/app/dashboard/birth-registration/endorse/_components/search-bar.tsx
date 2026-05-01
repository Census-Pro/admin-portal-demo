'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useTransition, useRef } from 'react';
import { toast } from 'sonner';
import { IconRefresh } from '@tabler/icons-react';
import { resetBirthApplicationsData } from '@/actions/common/birth-registration-actions';

export function EndorseSearchBar() {
  const [isLoading, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

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

  const handleReset = async () => {
    try {
      const result = await resetBirthApplicationsData();
      if (result.success) {
        toast.success(result.message);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.error('Failed to reset data');
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="flex w-full gap-2 md:max-w-lg">
      <Input
        placeholder="Search by name or CID..."
        defaultValue={searchParams.q}
        onChange={(e) => handleSearch(e.target.value)}
        className={cn('flex-1', isLoading && 'animate-pulse')}
      />
      <Button
        variant="outline"
        onClick={handleReset}
        className="whitespace-nowrap"
      >
        <IconRefresh className="mr-2 h-4 w-4" />
        Reset All
      </Button>
    </div>
  );
}
