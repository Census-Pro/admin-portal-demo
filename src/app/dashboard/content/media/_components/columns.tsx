'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MediaItem } from '@/actions/common/cms-actions';

interface ColumnProps {
  onEdit: (data: MediaItem) => void;
  onDelete: (id: string) => void;
}

export const getColumns = ({
  onEdit,
  onDelete
}: ColumnProps): ColumnDef<MediaItem>[] => [
  {
    accessorKey: 'fileName',
    header: 'File Name',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.fileName}</div>
    )
  },
  {
    accessorKey: 'fileType',
    header: 'Type',
    cell: ({ row }) => <Badge variant="outline">{row.original.fileType}</Badge>
  },
  {
    accessorKey: 'size',
    header: 'Size'
  },
  {
    accessorKey: 'uploadDate',
    header: 'Upload Date'
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row.original)}
        >
          <IconEdit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original.id)}
          className="text-destructive hover:text-destructive"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
    )
  }
];
