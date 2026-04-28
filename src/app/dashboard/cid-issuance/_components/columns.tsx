'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconEye } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { getStatusColor } from '@/lib/status-utils';

export interface CIDApplication {
  id: string;
  application_no?: string;
  applicant_cid_no?: string;
  applicant_contact_no?: string;
  cid_no?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  parent_cid_no?: string;
  parent_contact_no?: string;
  date_of_birth?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  payment_type_id?: string;
  parent_approval?: string;
  reasons_id?: string;
  photo_url?: string;
  place_of_collection?: string;
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
    accessorKey: 'application_no',
    header: 'Application No',
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue('application_no') || 'N/A'}
        </div>
      );
    }
  },
  {
    accessorKey: 'first_name',
    header: 'Applicant Name',
    cell: ({ row }) => {
      const firstName = row.getValue('first_name') as string;
      const middleName = row.original.middle_name;
      const lastName = row.original.last_name;
      const fullName = [firstName, middleName, lastName]
        .filter(Boolean)
        .join(' ');
      return <div className="font-medium">{fullName || 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'applicant_cid_no',
    header: 'Applicant CID',
    cell: ({ row }) => {
      const cid = row.getValue('applicant_cid_no') as string;
      return <div className="font-mono">{cid || 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'applicant_contact_no',
    header: 'Contact No',
    cell: ({ row }) => {
      const contact = row.getValue('applicant_contact_no') as string;
      return <div>{contact || 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'date_of_birth',
    header: 'Date of Birth',
    cell: ({ row }) => {
      const date = row.getValue('date_of_birth') as string;
      if (!date) return '-';
      try {
        return format(new Date(date), 'MMM dd, yyyy');
      } catch {
        return date;
      }
    }
  },
  {
    accessorKey: 'parent_approval',
    header: 'Parent Approval',
    cell: ({ row }) => {
      const approval = row.getValue('parent_approval') as string;
      if (!approval) return '-';
      const { variant, className } = getStatusColor(approval);
      return (
        <Badge variant={variant} className={`whitespace-nowrap ${className}`}>
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
