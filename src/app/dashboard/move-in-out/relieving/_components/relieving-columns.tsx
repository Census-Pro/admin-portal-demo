'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoveInOutApplication } from '@/actions/common/move-in-out-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconEye } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { getStatusColor } from '@/lib/status-utils';

function ActionsCell({ application }: { application: MoveInOutApplication }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          router.push(`/dashboard/move-in-out/relieving/${application.id}`)
        }
      >
        <IconEye className="h-4 w-4" />
        <span className="sr-only">View Details</span>
      </Button>
    </div>
  );
}

export const columns: ColumnDef<MoveInOutApplication>[] = [
  {
    accessorKey: 'application_no',
    header: 'Application No',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('application_no')}</div>
    )
  },
  {
    accessorKey: 'name',
    header: 'Applicant Name',
    cell: ({ row }) => <div>{row.getValue('name')}</div>
  },
  {
    accessorKey: 'cid_no',
    header: 'CID No',
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue('cid_no')}</div>
    )
  },
  {
    accessorKey: 'applicant_contact_no',
    header: 'Contact',
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('applicant_contact_no')}</div>
    )
  },
  {
    accessorKey: 'household_no',
    header: 'Household No',
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue('household_no')}</div>
    )
  },
  {
    accessorKey: 'inter_dzongkhag',
    header: 'Inter Dzongkhag',
    cell: ({ row }) => {
      const value = row.getValue('inter_dzongkhag') as string;
      return (
        <Badge
          variant="default"
          className={
            value === 'YES'
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-red-600 text-white hover:bg-red-700'
          }
        >
          {value}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'area_type',
    header: 'Area Type',
    cell: ({ row }) => {
      const value = row.getValue('area_type') as string;
      return (
        <Badge
          variant="default"
          className={
            value === 'URBAN'
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : value === 'RURAL'
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-gray-600 text-white hover:bg-gray-700'
          }
        >
          {value}
        </Badge>
      );
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
    accessorKey: 'createdAt',
    header: 'Applied Date',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string;
      return (
        <div className="text-sm">{format(new Date(date), 'MMM dd, yyyy')}</div>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const application = row.original;
      return <ActionsCell application={application} />;
    }
  }
];
