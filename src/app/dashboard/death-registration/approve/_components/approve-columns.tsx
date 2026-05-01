'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconEye, IconUserCheck } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { getStatusColor } from '@/lib/status-utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { assignDeathTask } from '@/actions/common/death-registration-actions';

export type DeathRegistrationApprove = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  deceased_cid: string;
  date_of_death: string;
  status: string;
  created_at: string;
  updatedAt?: string;
};

interface ActionsCellProps {
  registration: DeathRegistrationApprove;
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

  const handleAssignToMe = async () => {
    onAssignStart?.(registration.id);
    try {
      const result = await assignDeathTask(registration.id);
      if (result.success) {
        toast.success('Task assigned to you successfully');
        // Call the onAssign callback to hide the row immediately
        onAssign?.(registration.id);
      } else {
        toast.error('Failed to assign task');
        onAssignError?.(registration.id);
      }
    } catch {
      toast.error('An unexpected error occurred');
      onAssignError?.(registration.id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={`/dashboard/death-registration/approve/${registration.id}`}>
        <Button variant="ghost" size="icon">
          <IconEye className="h-4 w-4" />
          <span className="sr-only">View Details</span>
        </Button>
      </Link>
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

export const columns: ColumnDef<DeathRegistrationApprove>[] = [
  {
    accessorKey: 'deceased_cid',
    header: 'CID',
    enableSorting: true
  },
  {
    accessorKey: 'first_name',
    header: 'First Name',
    enableSorting: true
  },
  {
    accessorKey: 'middle_name',
    header: 'Middle Name',
    enableSorting: false,
    cell: ({ row }) => {
      const middleName = row.getValue('middle_name') as string;
      return middleName || '-';
    }
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
    enableSorting: true
  },
  {
    accessorKey: 'date_of_death',
    header: 'Date of Death',
    enableSorting: true,
    cell: ({ row }) => {
      const date = row.getValue('date_of_death') as string;
      return format(new Date(date), 'MMM dd, yyyy');
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Endorse Date',
    enableSorting: true,
    cell: ({ row }) => {
      const date = row.getValue('updatedAt') as string;
      const status = row.getValue('status') as string;
      return status === 'ENDORSED' && date
        ? format(new Date(date), 'MMM dd, yyyy')
        : '-';
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
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
