'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { FaqCategory } from '@/actions/common/cms-actions';
import { FaqCategoryActionCell } from './faq-category-cell-action';

export const createFaqCategoryColumns = (
  handleStatusChange?: (id: string, newStatus: boolean) => void
): ColumnDef<FaqCategory>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <span className="text-foreground font-medium tracking-tight">
            {row.getValue('name')}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-mono text-xs">
        {row.getValue('slug')}
      </Badge>
    )
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      return description ? (
        <span className="text-muted-foreground line-clamp-1 text-sm">
          {description}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm italic">—</span>
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
    cell: ({ row }) => <FaqCategoryActionCell data={row.original} />,
    size: 120
  }
];
