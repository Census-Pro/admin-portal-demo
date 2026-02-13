'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconEye } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { getStatusColor, getTypeColor } from '@/lib/status-utils';

export interface CIDApplication {
  id: string;
  applicant_name: string;
  applicant_cid?: string;
  date_of_birth: string;
  gender: string;
  dzongkhag: string;
  gewog: string;
  application_type: 'NEW' | 'RENEWAL' | 'REPLACEMENT' | 'UPDATE';
  status: string;
  created_at?: string;
  phone_number?: string;
  email?: string;
}

function ActionsCell({ application }: { application: CIDApplication }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push(`/dashboard/cid-issuance/${application.id}`)}
      >
        <IconEye className="h-4 w-4" />
        <span className="sr-only">View Details</span>
      </Button>
    </div>
  );
}

export const columns: ColumnDef<CIDApplication>[] = [
  {
    accessorKey: 'applicant_name',
    header: 'Applicant Name',
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue('applicant_name')}</div>
      );
    }
  },
  {
    accessorKey: 'applicant_cid',
    header: 'CID Number',
    cell: ({ row }) => {
      const cid = row.getValue('applicant_cid') as string;
      return <div className="font-mono">{cid || 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'date_of_birth',
    header: 'Date of Birth',
    cell: ({ row }) => {
      const date = row.getValue('date_of_birth') as string;
      try {
        return format(new Date(date), 'MMM dd, yyyy');
      } catch {
        return date;
      }
    }
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => {
      return <div>{row.getValue('gender')}</div>;
    }
  },
  {
    accessorKey: 'dzongkhag',
    header: 'Dzongkhag',
    cell: ({ row }) => {
      return (
        <div className="max-w-[150px] truncate">
          {row.getValue('dzongkhag')}
        </div>
      );
    }
  },
  {
    accessorKey: 'application_type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('application_type') as string;
      const { variant, className } = getTypeColor(type);

      return (
        <Badge variant={variant} className={`whitespace-nowrap ${className}`}>
          {type}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Submitted Date',
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string;
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
    cell: ({ row }) => <ActionsCell application={row.original} />
  }
];
