'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { Input } from '@/components/ui/input';
import { columns, CIDApplication } from '../../../_components/columns';
import { DUMMY_CID_REPLACEMENT_APPROVAL_APPLICATIONS } from '../../../_dummy-data';
import { getCidReplacementApprovalDoneIds } from '@/lib/cid-assessed-store';

export function CidReplacementApprovalTable() {
  const [applications, setApplications] = useState<CIDApplication[]>(
    DUMMY_CID_REPLACEMENT_APPROVAL_APPLICATIONS
  );

  useEffect(() => {
    const doneIds = getCidReplacementApprovalDoneIds();
    if (doneIds.size > 0) {
      setApplications(
        DUMMY_CID_REPLACEMENT_APPROVAL_APPLICATIONS.filter(
          (a) => !doneIds.has(a.id)
        )
      );
    }
  }, []);

  return (
    <div className="space-y-4">
      <Input placeholder="Search applications..." className="max-w-sm" />
      <DataTable
        columns={columns}
        data={applications}
        totalItems={applications.length}
      />
    </div>
  );
}
