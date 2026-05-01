'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { Input } from '@/components/ui/input';
import {
  assessmentColumns,
  CIDApplicationResponse
} from '../../../_components/assessment-columns';
import { DUMMY_CID_APPLICATIONS } from '../../../_dummy-data';
import { getCidAssessedIds } from '@/lib/cid-assessed-store';

export function CidAssessmentTable() {
  const [applications, setApplications] = useState<CIDApplicationResponse[]>(
    DUMMY_CID_APPLICATIONS
  );

  useEffect(() => {
    const doneIds = getCidAssessedIds();
    if (doneIds.size > 0) {
      setApplications(DUMMY_CID_APPLICATIONS.filter((a) => !doneIds.has(a.id)));
    }
  }, []);

  return (
    <div className="space-y-4">
      <Input placeholder="Search applications..." className="max-w-sm" />
      <DataTable
        columns={assessmentColumns}
        data={applications}
        totalItems={applications.length}
      />
    </div>
  );
}
