'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { createColumns } from './columns';
import { getCountries } from '@/actions/common/country-actions';
import { toast } from 'sonner';

export default function CountriesTable() {
  const [data, setData] = useState([]);
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

  const columns = createColumns({ onRefresh: fetchCountries });

  if (isLoading) {
    return <DataTable columns={columns} data={[]} totalItems={0} />;
  }

  return <DataTable columns={columns} data={data} totalItems={totalItems} />;
}
