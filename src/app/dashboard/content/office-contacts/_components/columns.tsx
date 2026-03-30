'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconBuilding,
  IconCopy
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OfficeContact } from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { ActionCell } from './cell-action';
import Link from 'next/link';

export const createColumns = (
  handleStatusChange?: (id: string, newStatus: boolean) => void
): ColumnDef<OfficeContact>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>
  },
  {
    accessorKey: 'place',
    header: 'Place',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('place')}</div>
    )
  },
  {
    accessorKey: 'contact',
    header: 'Contact',
    cell: ({ row }) => (
      <div className="font-medium">
        <div className="flex items-center gap-2">
          <IconPhone className="h-4 w-4" />
          {row.getValue('contact')}
        </div>
      </div>
    )
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.getValue('email');
      return (
        <div className="font-medium">
          {email ? (
            <div className="flex items-center gap-2">
              <IconMail className="h-4 w-4" />
              <Link
                href={`mailto:${email}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {email as string}
              </Link>
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
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
        <div className="font-medium">
          {category?.name ? (
            <Badge variant="secondary">{category.name}</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive');
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionCell data={row.original} />
  }
];
