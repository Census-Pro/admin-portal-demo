'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Faq } from '@/actions/common/cms-actions';
import { ActionCell } from './cell-action';

export const createColumns = (
  handleStatusChange?: (id: string, newStatus: boolean) => void
): ColumnDef<Faq>[] => [
  {
    accessorKey: 'question',
    header: 'Question',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <span className="text-foreground font-medium tracking-tight">
            {row.getValue('question')}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'answer',
    header: 'Answer',
    cell: ({ row }) => {
      const answer = (row.getValue('answer') as string) || '';
      const truncated =
        answer.length > 80 ? answer.substring(0, 80) + '...' : answer;
      return (
        <div className="text-muted-foreground max-w-md text-sm">
          {truncated}
        </div>
      );
    }
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <Badge variant="outline" className="capitalize">
          {category?.name || 'Uncategorized'}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status === 'active' ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      );
    },
    size: 100
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionCell data={row.original} />,
    size: 120
  }
];
