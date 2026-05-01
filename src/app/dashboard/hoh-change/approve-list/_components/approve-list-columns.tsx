'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconEye } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { getStatusColor } from '@/lib/status-utils';
import type { HohChange } from '../_components/columns';

export type { HohChange };

function ActionsCell({ registration }: { registration: HohChange }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          router.push(`/dashboard/hoh-change/${registration.applicationNo}`)
        }
      >
        <IconEye className="h-4 w-4" />
        <span className="sr-only">View Details</span>
      </Button>
    </div>
  );
}

export const approveListColumns: ColumnDef<HohChange>[] = [
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
    cell: ({ row }) => <ActionsCell registration={row.original} />
  }
];
