'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useTransition, useRef } from 'react';

export function CitiesSearchBar() {
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
    <Input
      placeholder="Search by name..."
      defaultValue={searchParams.q}
      onChange={(e) => handleSearch(e.target.value)}
      className={cn('w-full md:max-w-sm', isLoading && 'animate-pulse')}
    />
  );
}
