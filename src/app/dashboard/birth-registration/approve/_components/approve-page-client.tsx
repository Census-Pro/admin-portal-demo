'use client';

import { useState, useCallback, useEffect } from 'react';
import { ApproveSearchBar } from './search-bar';
import { columns } from './approve-columns';
import { DataTable } from '@/components/ui/table/data-table';
import { getEndorsedBirthApplications } from '@/actions/common/birth-registration-actions';
import {
  getBirthApprovedIds,
  markBirthApproved
} from '@/lib/cid-assessed-store';

interface BirthRegistration {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  applicant_cid: string;
  date_of_birth: string;
  status: string;
  createdAt?: string;
}

export function ApprovePageClient() {
  const [data, setData] = useState<BirthRegistration[]>([]);
  const [assigningIds, setAssigningIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getEndorsedBirthApplications();
        if (cancelled) return;

        if (!result.success) {
          setError('Failed to fetch applications');
          return;
        }

        const approvedIds = getBirthApprovedIds();
        setData(
          (result.data as BirthRegistration[]).filter(
            (r) => !approvedIds.has(r.id)
          )
        );
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAssign = useCallback((id: string) => {
    markBirthApproved(id);
    setData((prev) => prev.filter((r) => r.id !== id));
    setAssigningIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleAssignStart = useCallback((id: string) => {
    setAssigningIds((prev) => new Set(Array.from(prev).concat(id)));
  }, []);

  const handleAssignError = useCallback((id: string) => {
    setAssigningIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleResetAll = useCallback(() => {
    // no-op: store-based approach persists across navigation
  }, []);

  // Filter out approved items
  const filteredData = data;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ApproveSearchBar />
        <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
          Loading applications…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ApproveSearchBar />
        <div className="flex h-32 items-center justify-center text-sm text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ApproveSearchBar onResetAll={handleResetAll} hiddenCount={0} />
      <DataTable
        columns={columns}
        data={filteredData}
        totalItems={filteredData.length}
        meta={{
          onAssign: handleAssign,
          onAssignStart: handleAssignStart,
          onAssignError: handleAssignError,
          assigningIds
        }}
      />
    </div>
  );
}
