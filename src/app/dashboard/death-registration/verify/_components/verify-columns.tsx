'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconEye, IconUserCheck } from '@tabler/icons-react';
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
  created_at: string;
};

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
    accessorKey: 'created_at',
    header: 'Submitted Date',
    enableSorting: true,
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string;
      return format(new Date(date), 'MMM dd, yyyy');
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
    cell: ({ row }) => {
      const registration = row.original;
      return (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/death-registration/verify/${registration.id}`}
          >
            <Button variant="ghost" size="icon">
              <IconEye className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-teal-600 bg-teal-600 text-xs text-white hover:border-teal-700 hover:bg-teal-700 hover:text-white"
            onClick={() => {}}
          >
            <IconUserCheck className="h-3.5 w-3.5" />
            Assign to me
          </Button>
        </div>
      );
    }
  }
];
