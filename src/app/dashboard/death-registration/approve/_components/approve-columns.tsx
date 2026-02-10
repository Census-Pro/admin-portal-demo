'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconEye } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';

export type DeathRegistrationApprove = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  deceased_cid: string;
  date_of_death: string;
  status: string;
  created_at: string;
  verified_at?: string;
};

export const columns: ColumnDef<DeathRegistrationApprove>[] = [
  {
    accessorKey: 'deceased_cid',
    header: 'CID'
  },
  {
    accessorKey: 'first_name',
    header: 'First Name'
  },
  {
    accessorKey: 'middle_name',
    header: 'Middle Name',
    cell: ({ row }) => {
      const middleName = row.getValue('middle_name') as string;
      return middleName || '-';
    }
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name'
  },
  {
    accessorKey: 'date_of_death',
    header: 'Date of Death',
    cell: ({ row }) => {
      const date = row.getValue('date_of_death') as string;
      return format(new Date(date), 'MMM dd, yyyy');
    }
  },
  {
    accessorKey: 'verified_at',
    header: 'Verified Date',
    cell: ({ row }) => {
      const date = row.getValue('verified_at') as string;
      return date ? format(new Date(date), 'MMM dd, yyyy') : '-';
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusLower = status?.toLowerCase() || '';

      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'default';
      let customClass = '';

      if (statusLower === 'approved' || statusLower === 'verified') {
        variant = 'outline';
        customClass = 'border-green-500 text-green-700 bg-green-50';
      } else if (statusLower === 'rejected' || statusLower === 'cancelled') {
        variant = 'destructive';
      } else if (statusLower === 'pending' || statusLower === 'submitted') {
        variant = 'secondary';
        if (statusLower === 'submitted') {
          customClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
        }
      }

      return (
        <Badge variant={variant} className={`uppercase ${customClass}`}>
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
            href={`/dashboard/death-registration/approve/${registration.id}`}
          >
            <Button variant="ghost" size="icon">
              <IconEye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    }
  }
];
