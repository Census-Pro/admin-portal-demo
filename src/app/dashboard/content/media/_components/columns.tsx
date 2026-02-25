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
    accessorKey: 'preview',
    header: 'Preview',
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="bg-muted flex h-12 w-12 items-center justify-center overflow-hidden rounded border">
          {item.fileType.startsWith('image/') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt={item.fileName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground text-[10px] font-bold">
              {item.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
            </div>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'fileName',
    header: 'File Name'
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
    header: 'Uploaded'
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
