'use client';

import { MoveInOutApplicationsTable } from '../../_components/move-in-out-applications-table';
import { columns } from './relieving-columns';

export function RelievingPageClient() {
  return <MoveInOutApplicationsTable columns={columns} />;
}
