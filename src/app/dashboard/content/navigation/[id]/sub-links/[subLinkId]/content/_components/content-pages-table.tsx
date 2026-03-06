'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { CmsPage, SubLink } from '@/actions/common/cms-actions';

interface ContentPagesTableProps {
  data: CmsPage[];
  subLink: SubLink;
}

export function ContentPagesTable({ data, subLink }: ContentPagesTableProps) {
  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data} totalItems={data.length} />

      {data.length === 0 && (
        <div className="bg-muted/50 border-muted rounded-lg border-2 border-dashed p-12 text-center">
          <h3 className="text-lg font-semibold">No content pages yet</h3>
          <p className="text-muted-foreground mt-2">
            Create content pages under "{subLink.label}" to get started
          </p>
        </div>
      )}
    </div>
  );
}
