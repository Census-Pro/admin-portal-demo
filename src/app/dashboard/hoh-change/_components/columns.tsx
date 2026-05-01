'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconEye, IconUserCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { getStatusColor } from '@/lib/status-utils';
import { toast } from 'sonner';

export interface HohChange {
  id: string;
  applicationNo: string;
  applicantCidNo: string;
  applicantIs: string;
  householdNo: string;
  hohCidNo: string;
  newHohCidNo: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  status: string;
  createdAt: string;
  dzongkhagName?: string;
}

interface ActionsCellProps {
  registration: HohChange;
  onAssign?: (id: string) => void;
  onAssignStart?: (id: string) => void;
  onAssignError?: (id: string) => void;
  isAssigning?: boolean;
}

function ActionsCell({
  registration,
  onAssign,
  onAssignStart,
  onAssignError,
  isAssigning
}: ActionsCellProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/hoh-change/${registration.applicationNo}`);
  };

  const handleAssignToMe = () => {
    onAssignStart?.(registration.id);
    try {
      toast.success('Task assigned to you successfully');
      onAssign?.(registration.id);
    } catch {
      toast.error('An unexpected error occurred');
      onAssignError?.(registration.id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={handleClick}>
        <IconEye className="h-4 w-4" />
        <span className="sr-only">View Details</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 border-teal-600 bg-teal-600 text-xs text-white hover:border-teal-700 hover:bg-teal-700 hover:text-white"
        onClick={handleAssignToMe}
        disabled={isAssigning}
      >
        <IconUserCheck className="h-3.5 w-3.5" />
        {isAssigning ? 'Assigning...' : 'Assign to me'}
      </Button>
    </div>
  );
}

export const columns: ColumnDef<HohChange>[] = [
  {
    accessorKey: 'applicationNo',
    header: 'Application No.',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('applicationNo') || '-'}</div>
    )
  },
  {
    accessorKey: 'applicantCidNo',
    header: 'Applicant CID'
  },
  {
    accessorKey: 'householdNo',
    header: 'Household No.'
  },
  {
    accessorKey: 'dzongkhagName',
    header: 'Dzongkhag',
    cell: ({ row }) => (
      <div>{(row.getValue('dzongkhagName') as string) || '-'}</div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string;
      if (!date) return '-';
      try {
        return format(new Date(date), 'MMM dd, yyyy');
      } catch {
        return date;
      }
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = (row.getValue('status') as string) || 'PENDING';
      const { variant, className } = getStatusColor(status);

      return (
        <Badge variant={variant} className={`uppercase ${className}`}>
          {status}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => {
      const registration = row.original;
      const meta = table.options.meta as any;
      const assigningIds = meta?.assigningIds as Set<string> | undefined;
      const isAssigning = assigningIds?.has(registration.id) ?? false;

      return (
        <ActionsCell
          registration={registration}
          onAssign={meta?.onAssign}
          onAssignStart={meta?.onAssignStart}
          onAssignError={meta?.onAssignError}
          isAssigning={isAssigning}
        />
      );
    }
  }
];
