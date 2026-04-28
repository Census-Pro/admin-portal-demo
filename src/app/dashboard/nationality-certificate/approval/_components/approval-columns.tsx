'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconEye } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export interface NationalityApplicationApproval {
  id: string;
  createdAt: string;
  created_at?: string;
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
  fee?: {
    id: string;
    application_no: string;
    amount: number;
    status: string;
    transaction_no: string | null;
    contact_no: string;
    payment_service_type_id: string;
  };
}

function ActionsCell({
  application
}: {
  application: NationalityApplicationApproval;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          router.push(
            `/dashboard/nationality-certificate/${application.id}?from=approval`
          )
        }
      >
        <IconEye className="h-4 w-4" />
        <span className="sr-only">View Details</span>
      </Button>
    </div>
  );
}

export const approvalColumns: ColumnDef<NationalityApplicationApproval>[] = [
  {
    accessorKey: 'application_no',
    header: 'Application No.',
    cell: ({ row }) => (
      <div className="font-mono font-medium">
        {row.getValue('application_no')}
      </div>
    )
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
      return type === 'PARENT' ? (
        <Badge className="bg-purple-600 text-white hover:bg-purple-700">
          {type?.replace(/_/g, ' ') || 'N/A'}
        </Badge>
      ) : (
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
    accessorKey: 'fee.status',
    header: 'Payment Status',
    cell: ({ row }) => {
      const fee = row.original.fee;
      if (fee?.status) {
        return (
          <Badge
            variant="outline"
            className={
              fee.status === 'PAID'
                ? 'border-green-600 bg-green-600 text-white'
                : fee.status === 'PENDING'
                  ? 'border-yellow-600 bg-yellow-600 text-white'
                  : 'border-red-600 bg-red-600 text-white'
            }
          >
            {fee.status}
          </Badge>
        );
      }
      return <span className="text-muted-foreground">-</span>;
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Applied On',
    cell: ({ row }) => {
      try {
        return format(
          new Date(row.original.created_at ?? row.original.createdAt),
          'MMM dd, yyyy'
        );
      } catch {
        return '-';
      }
    }
  },
  {
    accessorKey: 'application_status',
    header: 'Application Status',
    cell: ({ row }) => {
      const status = row.getValue('application_status') as string;
      return (
        <Badge variant={status === 'ASSESSED' ? 'default' : 'secondary'}>
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
