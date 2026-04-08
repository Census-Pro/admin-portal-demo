'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useTransition, useRef } from 'react';

export function OperatorsSearchBar() {
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
        setSearchParams({ q: value, page: 1 });
      });
    }, 300);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative max-w-sm flex-1">
        <Input
          placeholder="Search by CID number..."
          value={searchParams.q}
          onChange={(e) => handleSearch(e.target.value)}
          className={cn('pr-4', isLoading && 'animate-pulse')}
        />
      </div>
    </div>
  );
}
