'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import {
  approvalColumns,
  NationalityApplicationApproval
} from '../_components/approval-columns';
import { getNcApprovalDoneIds } from '@/lib/nc-assessed-store';

const ALL_APPLICATIONS: NationalityApplicationApproval[] = [
  {
    id: 'a1',
    application_no: 'NC-2026-00001',
    applicant_cid_no: '11801000123',
    applicant_contact_no: '17654321',
    applicant_is: 'SELF',
    minor_cid: '11815000101',
    minor_name: 'Pema Dorji',
    dob: '1988-03-15',
    parent_approval: 'PENDING',
    application_status: 'ASSESSED',
    createdAt: '2026-04-10T08:30:00.000Z',
    updatedAt: '2026-04-22T09:00:00.000Z',
    fee: {
      id: 'fee-a1',
      application_no: 'NC-2026-00001',
      amount: 500,
      status: 'PAID',
      transaction_no: 'TXN-20260422-001',
      contact_no: '17654321',
      payment_service_type_id: 'svc-1'
    }
  },
  {
    id: 'a2',
    application_no: 'NC-2026-00002',
    applicant_cid_no: '11801000456',
    applicant_contact_no: '17123456',
    applicant_is: 'PARENT',
    minor_cid: '11815000789',
    minor_name: 'Tenzin Wangchuk',
    dob: '2015-06-20',
    parent_approval: 'PENDING',
    application_status: 'ASSESSED',
    createdAt: '2026-04-12T10:15:00.000Z',
    updatedAt: '2026-04-23T11:00:00.000Z',
    fee: {
      id: 'fee-a2',
      application_no: 'NC-2026-00002',
      amount: 500,
      status: 'PAID',
      transaction_no: 'TXN-20260423-002',
      contact_no: '17123456',
      payment_service_type_id: 'svc-1'
    }
  },
  {
    id: 'a3',
    application_no: 'NC-2026-00003',
    applicant_cid_no: '11801000789',
    applicant_contact_no: '17987654',
    applicant_is: 'SELF',
    minor_cid: '11815000303',
    minor_name: 'Sonam Choden',
    dob: '1995-11-08',
    parent_approval: 'PENDING',
    application_status: 'ASSESSED',
    createdAt: '2026-04-18T14:00:00.000Z',
    updatedAt: '2026-04-24T13:00:00.000Z',
    fee: {
      id: 'fee-a3',
      application_no: 'NC-2026-00003',
      amount: 500,
      status: 'PAID',
      transaction_no: 'TXN-20260424-003',
      contact_no: '17987654',
      payment_service_type_id: 'svc-1'
    }
  }
];

export function NcApprovalTable() {
  const [applications, setApplications] =
    useState<NationalityApplicationApproval[]>(ALL_APPLICATIONS);

  useEffect(() => {
    const doneIds = getNcApprovalDoneIds();
    if (doneIds.size > 0) {
      setApplications(ALL_APPLICATIONS.filter((a) => !doneIds.has(a.id)));
    }
  }, []);

  return (
    <DataTable
      columns={approvalColumns}
      data={applications}
      totalItems={applications.length}
    />
  );
}
