'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconEye } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface BirthRegistration {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  applicant_cid: string;
  date_of_birth: string;
  status: string;
  created_at?: string;
}

function ActionsCell({ registration }: { registration: BirthRegistration }) {
  const router = useRouter();

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          router.push(
            `/dashboard/birth-registration/endorse/${registration.id}`
          )
        }
      >
        <IconEye className="h-4 w-4" />
        <span className="sr-only">View Details</span>
      </Button>
    </div>
  );
}

export const columns: ColumnDef<BirthRegistration>[] = [
  {
    accessorKey: 'applicant_cid',
    header: 'Applicant CID',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('applicant_cid')}</div>;
    }
  },
  {
    accessorKey: 'child_name',
    header: 'Child Name',
    cell: ({ row }) => {
      const registration = row.original;
      const fullName = [
        registration.first_name,
        registration.middle_name,
        registration.last_name
      ]
        .filter(Boolean)
        .join(' ');
      return <div className="font-medium">{fullName}</div>;
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

      if (
        statusLower === 'approved' ||
        statusLower === 'verified' ||
        statusLower === 'endorsed'
      ) {
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
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const registration = row.original;
      return <ActionsCell registration={registration} />;
    }
  }
];
