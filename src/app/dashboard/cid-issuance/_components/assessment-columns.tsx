'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconEye } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { getStatusColor } from '@/lib/status-utils';

export interface CIDApplicationResponse {
  id: string;
  application_no: string;
  applicant_cid_no: string;
  applicant_contact_no?: string;
  cid_no: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  parent_cid_no: string;
  parent_contact_no: string;
  payment_type_id: string;
  parent_approval: string;
  date_of_birth: string;
  reasons_id: string;
  photo_url?: string;
  place_of_collection?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

function ActionsCell({ application }: { application: CIDApplicationResponse }) {
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

export const assessmentColumns: ColumnDef<CIDApplicationResponse>[] = [
  {
    accessorKey: 'application_no',
    header: 'Application No',
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue('application_no')}</div>
      );
    }
  },
  {
    id: 'applicant_name',
    header: 'Applicant Name',
    cell: ({ row }) => {
      const firstName = row.original.first_name;
      const middleName = row.original.middle_name || '';
      const lastName = row.original.last_name;
      const fullName = [firstName, middleName, lastName]
        .filter(Boolean)
        .join(' ');
      return <div className="font-medium">{fullName}</div>;
    }
  },
  {
    accessorKey: 'cid_no',
    header: 'CID Number',
    cell: ({ row }) => {
      const cid = row.getValue('cid_no') as string;
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
    accessorKey: 'applicant_contact_no',
    header: 'Contact',
    cell: ({ row }) => {
      const contact = row.getValue('applicant_contact_no') as string;
      return <div>{contact || '-'}</div>;
    }
  },
  {
    accessorKey: 'parent_approval',
    header: 'Parent Approval',
    cell: ({ row }) => {
      const approval = row.getValue('parent_approval') as string;
      const variant =
        approval === 'APPROVED'
          ? 'default'
          : approval === 'PENDING'
            ? 'outline'
            : 'destructive';

      const className =
        approval === 'PENDING'
          ? 'border-yellow-600 bg-yellow-600 text-white'
          : '';

      return (
        <Badge variant={variant} className={`uppercase ${className}`}>
          {approval}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Submitted Date',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string;
      if (!date) return '-';
      try {
        return format(new Date(date), 'MMM dd, yyyy HH:mm');
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
