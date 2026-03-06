'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { SubLink, NavigationItem } from '@/actions/common/cms-actions';

interface SubLinksTableProps {
  data: SubLink[];
  navigationItem: NavigationItem;
}

export function SubLinksTable({ data, navigationItem }: SubLinksTableProps) {
  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data} totalItems={data.length} />

      {data.length === 0 && (
        <div className="bg-muted/50 border-muted rounded-lg border-2 border-dashed p-12 text-center">
          <h3 className="text-lg font-semibold">No sub-links yet</h3>
          <p className="text-muted-foreground mt-2">
            Create sub-links to organize content under "{navigationItem.label}"
          </p>
        </div>
      )}
    </div>
  );
}
