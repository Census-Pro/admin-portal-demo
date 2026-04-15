'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconEye } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export interface RelationshipApplicationPayment {
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
  application: RelationshipApplicationPayment;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          router.push(
            `/dashboard/relation-certificate/${application.id}?from=payment`
          )
        }
      >
        <IconEye className="h-4 w-4" />
        <span className="sr-only">View Details</span>
      </Button>
    </div>
  );
}

export const paymentColumns: ColumnDef<RelationshipApplicationPayment>[] = [
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
    header: 'Applicant',
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.original.applicant_name}</div>
          <div className="text-muted-foreground text-sm">
            {row.original.applicant_cid}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'relationship_to_name',
    header: 'Related Person',
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.original.relationship_to_name}</div>
          <div className="text-muted-foreground text-sm">
            {row.original.relationship_to_cid}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'purpose',
    header: 'Purpose',
    cell: ({ row }) => {
      const purpose = row.original.purpose;
      return purpose && typeof purpose === 'object' && purpose.name
        ? purpose.name
        : '-';
    }
  },
  {
    accessorKey: 'fee.status',
    header: 'Payment Status',
    cell: ({ row }) => {
      const fee = row.original.fee;
      if (fee && fee.status) {
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
    accessorKey: 'createdAt',
    header: 'Applied On',
    cell: ({ row }) => {
      try {
        return format(new Date(row.getValue('createdAt')), 'MMM dd, yyyy');
      } catch {
        return row.getValue('createdAt');
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
    cell: ({ row }) => {
      return <ActionsCell application={row.original} />;
    }
  }
];
