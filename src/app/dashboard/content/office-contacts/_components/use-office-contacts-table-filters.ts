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
    setSearchQuery,
    isAnyFilterActive,
    setIsAnyFilterActive,
    page,
    setPage,
    resetFilters
  };
}
