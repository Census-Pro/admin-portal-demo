'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { Input } from '@/components/ui/input';
import { columns, CIDApplication } from '../../../_components/columns';
import { DUMMY_CID_RENEWAL_PAYMENT_APPLICATIONS } from '../../../_dummy-data';
import { getCidRenewalPaymentDoneIds } from '@/lib/cid-assessed-store';

export function CidRenewalPaymentTable() {
  const [applications, setApplications] = useState<CIDApplication[]>(
    DUMMY_CID_RENEWAL_PAYMENT_APPLICATIONS
  );

  useEffect(() => {
    const doneIds = getCidRenewalPaymentDoneIds();
    if (doneIds.size > 0) {
      setApplications(
        DUMMY_CID_RENEWAL_PAYMENT_APPLICATIONS.filter((a) => !doneIds.has(a.id))
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
