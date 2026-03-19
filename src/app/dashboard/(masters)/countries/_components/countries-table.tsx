'use client';

import { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { createColumns } from './columns';
import { getCountries } from '@/actions/common/country-actions';
import { toast } from 'sonner';

interface Country {
  id: string;
  name: string;
  nationality: string;
  isActive?: boolean;
}

export default function CountriesTable() {
  const [data, setData] = useState<Country[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCountries = async () => {
    setIsLoading(true);
    try {
      const result = await getCountries();
      console.log('Countries result:', result);

      if (!result.success) {
        toast.error(result.error || 'Failed to fetch countries');
      }

      setData(result.success ? result.data : []);
      setTotalItems(result.success ? result.data.length : 0);
    } catch (error) {
      console.error('Failed to fetch countries:', error);
      toast.error('An unexpected error occurred while fetching countries');
      setData([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleUpdate = useCallback((id: string, updatedItem: Country) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === id ? updatedItem : item))
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
    setTotalItems((prev) => prev - 1);
  }, []);

  const handleCreate = useCallback((newItem: Country) => {
    setData((prevData) => [newItem, ...prevData]);
    setTotalItems((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const handleCountryCreated = (event: Event) => {
      const customEvent = event as CustomEvent<Country>;
      if (customEvent.detail && customEvent.detail.id) {
        handleCreate(customEvent.detail);
      } else {
        // Fallback: re-fetch the list if the returned data is incomplete
        fetchCountries();
      }
    };

    window.addEventListener('country-created', handleCountryCreated);

    return () => {
      window.removeEventListener('country-created', handleCountryCreated);
    };
  }, [handleCreate]);

  const columns = createColumns(handleUpdate, handleDelete);

  if (isLoading) {
    return <DataTable columns={columns} data={[]} totalItems={0} />;
  }

  return <DataTable columns={columns} data={data} totalItems={totalItems} />;
}
