'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconRefresh } from '@tabler/icons-react';
import { MoveInOutApplicationsTable } from '../../_components/move-in-out-applications-table';
import { columns } from './relieving-columns';
import { resetMoveInOutDemo } from '@/actions/common/move-in-out-actions';
import { toast } from 'sonner';

export function RelievingPageClient() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const result = await resetMoveInOutDemo();
      if (result.success) {
        toast.success('All applications restored!');
        // Reload the page to show updated data
        window.location.reload();
      } else {
        toast.error('Failed to reset');
      }
    } catch (error) {
      toast.error('An error occurred while resetting');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <MoveInOutApplicationsTable
      key={refreshKey}
      columns={columns}
      headerAction={
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={isResetting}
        >
          <IconRefresh className="mr-2 h-4 w-4" />
          {isResetting ? 'Resetting...' : 'Reset All'}
        </Button>
      }
    />
  );
}
