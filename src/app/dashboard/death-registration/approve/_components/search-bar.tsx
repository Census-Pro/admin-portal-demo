'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useTransition, useRef } from 'react';
import { IconRotate } from '@tabler/icons-react';

interface ApproveSearchBarProps {
  onResetAll?: () => void;
  hiddenCount?: number;
}

export function ApproveSearchBar({
  onResetAll,
  hiddenCount = 0
}: ApproveSearchBarProps) {
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

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Search by name or CID..."
        defaultValue={searchParams.q}
        onChange={(e) => handleSearch(e.target.value)}
        className={cn('w-full md:max-w-sm', isLoading && 'animate-pulse')}
      />
      {hiddenCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onResetAll}
          className="h-9 gap-1.5 whitespace-nowrap"
        >
          <IconRotate className="h-4 w-4" />
          Reset All ({hiddenCount})
        </Button>
      )}
    </div>
  );
}
