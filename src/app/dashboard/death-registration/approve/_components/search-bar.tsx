'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useTransition, useRef } from 'react';
import { toast } from 'sonner';
import { IconRefresh } from '@tabler/icons-react';
import { resetAssignedDeathApplications } from '@/actions/common/death-registration-actions';

export function ApproveSearchBar() {
  const [isLoading, startTransition] = useTransition();
  const [isResetting, setIsResetting] = useTransition();
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
    setIsResetting(async () => {
      try {
        const result = await resetAssignedDeathApplications();
        if (result.success) {
          toast.success('All assignments have been reset!');
          // Refresh the page to show updated data
          window.location.reload();
        } else {
          toast.error('Failed to reset assignments');
        }
      } catch {
        toast.error('An unexpected error occurred');
      }
    });
  };

  return (
    <div className="flex gap-2">
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
        className="flex items-center gap-2"
      >
        <IconRefresh className="h-4 w-4" />
        {isResetting ? 'Resetting...' : 'Reset All'}
      </Button>
    </div>
  );
}
