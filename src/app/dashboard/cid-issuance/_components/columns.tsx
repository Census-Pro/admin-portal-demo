'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconEye } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

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
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          router.push(`/dashboard/cid-issuance/pending/${application.id}`)
        }
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
        return format(new Date(date), 'dd MMM yyyy');
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
      let variant: 'default' | 'secondary' | 'outline' = 'default';

      if (type === 'NEW') {
        variant = 'default';
      } else if (type === 'RENEWAL') {
        variant = 'secondary';
      } else if (type === 'REPLACEMENT' || type === 'UPDATE') {
        variant = 'outline';
      }

      return (
        <Badge variant={variant} className="whitespace-nowrap">
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
        return format(new Date(date), 'dd MMM yyyy');
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
      }

      return (
        <Badge variant={variant} className={customClass}>
          {status}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <ActionsCell application={row.original} />
  }
];
