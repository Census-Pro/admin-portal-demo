'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconPhone, IconMail, IconUser } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { OfficeContact } from '@/actions/common/cms-actions';
import { ActionCell } from './cell-action';
import Link from 'next/link';
import Image from 'next/image';

export const createColumns = (
  handleStatusChange?: (id: string, newStatus: boolean) => void
): ColumnDef<OfficeContact>[] => [
  {
    accessorKey: 'imageUrl',
    header: 'Image',
    enableSorting: false,
    cell: ({ row }) => {
      const imageUrl = row.getValue('imageUrl') as string;
      return (
        <div className="flex items-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${row.getValue('name')} profile`}
              width={40}
              height={40}
              className="rounded-full border object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-gray-200">
              <IconUser className="h-5 w-5 text-gray-500" />
            </div>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>
  },
  {
    accessorKey: 'place',
    header: 'Place',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('place')}</div>
    )
  },
  {
    accessorKey: 'contact',
    header: 'Contact',
    enableSorting: true,
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
    enableSorting: true,
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
    enableSorting: true,
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
    enableSorting: true,
    cell: ({ row }) => {
      const isActive = row.getValue('isActive');
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: ({ row }) => <ActionCell data={row.original} />
  }
];
