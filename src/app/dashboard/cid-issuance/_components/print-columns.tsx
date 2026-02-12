'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconPrinter, IconDownload } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export interface ApprovedCIDApplication {
  id: string;
  applicant_name: string;
  cid_number: string;
  date_of_birth: string;
  gender: string;
  dzongkhag: string;
  gewog: string;
  application_type: 'NEW' | 'RENEWAL' | 'REPLACEMENT' | 'UPDATE';
  approved_at: string;
  print_status: 'READY_TO_PRINT' | 'PRINTED' | 'COLLECTED';
}

function PrintActionsCell({
  application
}: {
  application: ApprovedCIDApplication;
}) {
  const handlePrint = () => {
    // TODO: Implement print functionality
    console.log('Print CID for:', application.cid_number);
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download CID details for:', application.cid_number);
  };

  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="icon" onClick={handleDownload}>
        <IconDownload className="h-4 w-4" />
        <span className="sr-only">Download</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrint}
        disabled={application.print_status === 'PRINTED'}
      >
        <IconPrinter className="h-4 w-4" />
        <span className="sr-only">Print CID</span>
      </Button>
    </div>
  );
}

export const printColumns: ColumnDef<ApprovedCIDApplication>[] = [
  {
    accessorKey: 'cid_number',
    header: 'CID Number',
    cell: ({ row }) => {
      return (
        <div className="font-mono font-medium">
          {row.getValue('cid_number')}
        </div>
      );
    }
  },
  {
    accessorKey: 'applicant_name',
    header: 'Name',
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue('applicant_name')}</div>
      );
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
    accessorKey: 'approved_at',
    header: 'Approved Date',
    cell: ({ row }) => {
      const date = row.getValue('approved_at') as string;
      try {
        return format(new Date(date), 'dd MMM yyyy');
      } catch {
        return date;
      }
    }
  },
  {
    accessorKey: 'print_status',
    header: 'Print Status',
    cell: ({ row }) => {
      const status = row.getValue('print_status') as string;
      let variant: 'default' | 'secondary' | 'outline' = 'default';
      let customClass = '';

      if (status === 'READY_TO_PRINT') {
        variant = 'secondary';
      } else if (status === 'PRINTED') {
        variant = 'outline';
        customClass = 'border-blue-500 text-blue-700 bg-blue-50';
      } else if (status === 'COLLECTED') {
        variant = 'outline';
        customClass = 'border-green-500 text-green-700 bg-green-50';
      }

      return (
        <Badge variant={variant} className={customClass}>
          {status.replace(/_/g, ' ')}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <PrintActionsCell application={row.original} />
  }
];
