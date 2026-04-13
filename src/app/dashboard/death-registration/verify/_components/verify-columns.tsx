'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconEye } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { getStatusColor } from '@/lib/status-utils';

export type DeathRegistrationVerify = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  deceased_cid: string;
  date_of_death: string;
  status: string;
  createdAt: string;
};

function ActionsCell({
  registration
}: {
  registration: DeathRegistrationVerify;
}) {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/dashboard/death-registration/verify/${registration.id}`}>
        <Button variant="ghost" size="icon">
          <IconEye className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

export const columns: ColumnDef<DeathRegistrationVerify>[] = [
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
    accessorKey: 'createdAt',
    header: 'Submitted Date',
    enableSorting: true,
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
    cell: ({ row }) => <ActionsCell registration={row.original} />
  }
];
