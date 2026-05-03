'use client';

import { useState, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import {
  paymentColumns,
  NationalityApplicationPayment
} from '../_components/payment-columns';
import { getNcPaymentDoneIds } from '@/lib/nc-assessed-store';
import { useQueryState, parseAsString } from 'nuqs';

const ALL_APPLICATIONS: NationalityApplicationPayment[] = [
  {
    id: 'p1',
    createdAt: '2026-04-10T08:30:00Z',
    updatedAt: '2026-04-22T09:00:00Z',
    application_no: 'NC-2026-00001',
    applicant_cid_no: '11801000123',
    applicant_contact_no: '17654321',
    applicant_is: 'SELF',
    minor_cid: '11815000101',
    minor_name: 'Pema Dorji',
    dob: '1988-03-15',
    parent_approval: 'PENDING',
    application_status: 'ASSESSED',
    fee: {
      id: 'fee-p1',
      application_no: 'NC-2026-00001',
      amount: 500,
      status: 'PENDING',
      transaction_no: null,
      contact_no: '17654321',
      payment_service_type_id: 'svc-1'
    }
  },
  {
    id: 'p2',
    createdAt: '2026-04-12T10:15:00Z',
    updatedAt: '2026-04-23T11:00:00Z',
    application_no: 'NC-2026-00002',
    applicant_cid_no: '11801000456',
    applicant_contact_no: '17123456',
    applicant_is: 'PARENT',
    minor_cid: '11815000789',
    minor_name: 'Tenzin Wangchuk',
    dob: '2015-06-20',
    parent_approval: 'PENDING',
    application_status: 'ASSESSED',
    fee: {
      id: 'fee-p2',
      application_no: 'NC-2026-00002',
      amount: 500,
      status: 'PENDING',
      transaction_no: null,
      contact_no: '17123456',
      payment_service_type_id: 'svc-1'
    }
  },
  {
    id: 'p3',
    createdAt: '2026-04-18T14:00:00Z',
    updatedAt: '2026-04-24T13:00:00Z',
    application_no: 'NC-2026-00003',
    applicant_cid_no: '11801000789',
    applicant_contact_no: '17987654',
    applicant_is: 'SELF',
    minor_cid: '11815000303',
    minor_name: 'Sonam Choden',
    dob: '1995-11-08',
    parent_approval: 'PENDING',
    application_status: 'ASSESSED',
    fee: {
      id: 'fee-p3',
      application_no: 'NC-2026-00003',
      amount: 500,
      status: 'PENDING',
      transaction_no: null,
      contact_no: '17987654',
      payment_service_type_id: 'svc-1'
    }
  }
];

export function NcPaymentTable() {
  const [applications, setApplications] =
    useState<NationalityApplicationPayment[]>(ALL_APPLICATIONS);
  const [q] = useQueryState('q', parseAsString.withDefault(''));

  useEffect(() => {
    const doneIds = getNcPaymentDoneIds();
    if (doneIds.size > 0) {
      setApplications(ALL_APPLICATIONS.filter((a) => !doneIds.has(a.id)));
    }
  }, []);

  const filtered = useMemo(() => {
    if (!q) return applications;
    const lower = q.toLowerCase();
    return applications.filter((app) => {
      const minorName = (app.minor_name ?? '').toLowerCase();
      const applicantCid = (app.applicant_cid_no ?? '').toLowerCase();
      const applicationNo = (app.application_no ?? '').toLowerCase();
      return (
        minorName.includes(lower) ||
        applicantCid.includes(lower) ||
        applicationNo.includes(lower)
      );
    });
  }, [applications, q]);

  return (
    <DataTable
      columns={paymentColumns}
      data={filtered}
      totalItems={filtered.length}
    />
  );
}
