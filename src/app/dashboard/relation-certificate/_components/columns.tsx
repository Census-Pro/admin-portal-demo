'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconEye } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { getStatusColor } from '@/lib/status-utils';

export interface RelationshipApplication {
  id: string;
  createdAt: string;
  updatedAt: string;
  application_no: string;
  applicant_cid: string;
  applicant_name: string;
  applicant_contact_no?: string;
  relationship_to_cid: string;
  relationship_to_name: string;
  purpose_id: string;
  payment_type_id?: string | null;
  payment_service_type_id: string;
  application_status: string;
  purpose?: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
  };
}

function ActionsCell({
  application
}: {
  application: RelationshipApplication;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          router.push(`/dashboard/relation-certificate/${application.id}`)
        }
      >
        <IconEye className="h-4 w-4" />
        <span className="sr-only">View Details</span>
      </Button>
    </div>
  );
}

export const columns: ColumnDef<RelationshipApplication>[] = [
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
    accessorKey: 'relationship_to_name',
    header: 'Related Person',
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue('relationship_to_name')}
        </div>
      );
    }
  },
  {
    accessorKey: 'relationship_to_cid',
    header: 'Related CID',
    cell: ({ row }) => {
      const cid = row.getValue('relationship_to_cid') as string;
      return <div className="font-mono">{cid || 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'purpose',
    header: 'Purpose',
    cell: ({ row }) => {
      const purpose = row.getValue('purpose') as any;
      const displayValue =
        purpose && typeof purpose === 'object' && purpose.name
          ? purpose.name
          : 'Not specified';
      return <div className="max-w-[150px] truncate">{displayValue}</div>;
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
