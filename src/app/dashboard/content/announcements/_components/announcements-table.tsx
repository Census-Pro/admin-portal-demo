'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { Announcement } from '@/actions/common/cms-actions';

interface AnnouncementsTableProps {
  data: Announcement[];
}

export function AnnouncementsTable({ data }: AnnouncementsTableProps) {
  return <DataTable columns={columns} data={data} totalItems={data.length} />;
}
