'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconEye, IconUserCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { getStatusColor } from '@/lib/status-utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { assignBirthTask } from '@/actions/common/birth-registration-actions';

interface BirthRegistration {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  applicant_cid: string;
  date_of_birth: string;
  status: string;
  createdAt?: string;
}

function ActionsCell({ registration }: { registration: BirthRegistration }) {
  const router = useRouter();
  const [isAssigning, setIsAssigning] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);

  const handleAssignToMe = async () => {
    setIsAssigning(true);
    try {
      const result = await assignBirthTask(registration.id);
      if (result.success) {
        setIsAssigned(true);
        toast.success('Task assigned to you successfully');
        setTimeout(() => router.refresh(), 1000);
      } else {
        toast.error(result.error || 'Failed to assign task');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
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
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 border-teal-600 bg-teal-600 text-xs text-white hover:border-teal-700 hover:bg-teal-700 hover:text-white"
        onClick={handleAssignToMe}
        disabled={isAssigning || isAssigned}
      >
        <IconUserCheck className="h-3.5 w-3.5" />
        {isAssigning
          ? 'Assigning...'
          : isAssigned
            ? 'Assigned'
            : 'Assign to me'}
      </Button>
    </div>
  );
}

export const columns: ColumnDef<BirthRegistration>[] = [
  {
    accessorKey: 'applicant_cid',
    header: 'Applicant CID',
    enableSorting: true,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('applicant_cid')}</div>;
    }
  },
  {
    accessorKey: 'first_name',
    header: 'First Name',
    enableSorting: true
  },
  {
    accessorKey: 'middle_name',
    header: 'Middle Name',
    enableSorting: false,
    cell: ({ row }) => {
      const middleName = row.getValue('middle_name') as string;
      return middleName || '-';
    }
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
    enableSorting: true
  },
  {
    accessorKey: 'date_of_birth',
    header: 'Date of Birth',
    enableSorting: true,
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
    accessorKey: 'createdAt',
    header: 'Submitted Date',
    enableSorting: true,
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
    enableSorting: true,
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
    cell: ({ row }) => {
      const registration = row.original;
      return <ActionsCell registration={registration} />;
    }
  }
];
