'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconEye } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { getStatusColor } from '@/lib/status-utils';

export interface NationalityApplication {
  id: string;
  createdAt: string;
  updatedAt: string;
  application_no: string;
  applicant_cid_no: string;
  applicant_contact_no: string;
  applicant_is: string;
  minor_cid: string | null;
  minor_name: string | null;
  dob: string | null;
  parent_approval: string;
  application_status: string;
}

function ActionsCell({ application }: { application: NationalityApplication }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          router.push(`/dashboard/nationality-certificate/${application.id}`)
        }
      >
        <IconEye className="h-4 w-4" />
        <span className="sr-only">View Details</span>
      </Button>
    </div>
  );
}

export const columns: ColumnDef<NationalityApplication>[] = [
  {
    accessorKey: 'application_no',
    header: 'Application No.',
    cell: ({ row }) => {
      return (
        <div className="font-mono font-medium">
          {row.getValue('application_no')}
        </div>
      );
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
    accessorKey: 'applicant_is',
    header: 'Applicant Type',
    cell: ({ row }) => {
      const type = row.getValue('applicant_is') as string;
      return (
        <Badge variant="outline">{type?.replace(/_/g, ' ') || 'N/A'}</Badge>
      );
    }
  },
  {
    accessorKey: 'minor_name',
    header: 'Minor Name',
    cell: ({ row }) => {
      const name = row.getValue('minor_name') as string;
      return <div>{name || '-'}</div>;
    }
  },
  {
    accessorKey: 'minor_cid',
    header: 'Minor CID',
    cell: ({ row }) => {
      const cid = row.getValue('minor_cid') as string;
      return <div className="font-mono">{cid || '-'}</div>;
    }
  },
  {
    accessorKey: 'applicant_contact_no',
    header: 'Contact',
    cell: ({ row }) => {
      const contact = row.getValue('applicant_contact_no') as string;
      return <div className="font-mono text-sm">{contact || '-'}</div>;
    }
  },
  {
    accessorKey: 'parent_approval',
    header: 'Parent Approval',
    cell: ({ row }) => {
      const approval = row.getValue('parent_approval') as string;
      return (
        <Badge
          variant={
            approval === 'APPROVED'
              ? 'default'
              : approval === 'PENDING'
                ? 'secondary'
                : 'destructive'
          }
        >
          {approval || 'N/A'}
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
    accessorKey: 'application_status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('application_status') as string;
      const { variant, className } = getStatusColor(status);
      return (
        <Badge variant={variant} className={className}>
          {status}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return <ActionsCell application={row.original} />;
    }
  }
];
