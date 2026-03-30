import { useState, useCallback } from 'react';

export function useOfficeContactsTableFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnyFilterActive, setIsAnyFilterActive] = useState(false);
  const [page, setPage] = useState(1);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setIsAnyFilterActive(false);
    setPage(1);
  }, []);

  return {
    searchQuery,
    setSearchQuery: setSearchQuery as (
      value: string | ((old: string) => string | null) | null,
      options?: any
    ) => void,
    isAnyFilterActive,
    setIsAnyFilterActive,
    page,
    setPage: setPage as (
      value: number | ((old: number) => number | null) | null,
      options?: any
    ) => void,
    resetFilters
  };
}
