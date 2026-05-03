'use client';

import { useState, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import {
  approvalColumns,
  RelationshipApplicationApproval
} from '../_components/approval-columns';
import { getRcApprovalDoneIds } from '@/lib/rc-assessed-store';
import { useQueryState, parseAsString } from 'nuqs';

const ALL_APPLICATIONS: RelationshipApplicationApproval[] = [
  {
    id: 'ra1',
    createdAt: '2026-04-08T09:00:00Z',
    updatedAt: '2026-04-22T10:00:00Z',
    application_no: 'RC-2026-00001',
    applicant_cid: '11801000123',
    applicant_name: 'Karma Tshering',
    applicant_contact_no: '17654321',
    relationship_to_cid: '11801000456',
    relationship_to_name: 'Pema Lhamo',
    purpose_id: 'pur-1',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'ASSESSED',
    purpose: { id: 'pur-1', createdAt: '', updatedAt: '', name: 'Employment' },
    fee: {
      id: 'fee-ra1',
      application_no: 'RC-2026-00001',
      amount: 300,
      status: 'PAID',
      transaction_no: 'TXN-20260422-001',
      contact_no: '17654321',
      payment_service_type_id: 'svc-1'
    }
  },
  {
    id: 'ra2',
    createdAt: '2026-04-14T11:30:00Z',
    updatedAt: '2026-04-23T11:00:00Z',
    application_no: 'RC-2026-00002',
    applicant_cid: '11801000789',
    applicant_name: 'Sonam Wangdi',
    applicant_contact_no: '17112233',
    relationship_to_cid: '11801001234',
    relationship_to_name: 'Dawa Zangmo',
    purpose_id: 'pur-2',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'ASSESSED',
    purpose: { id: 'pur-2', createdAt: '', updatedAt: '', name: 'Bank Loan' },
    fee: {
      id: 'fee-ra2',
      application_no: 'RC-2026-00002',
      amount: 300,
      status: 'PAID',
      transaction_no: 'TXN-20260423-002',
      contact_no: '17112233',
      payment_service_type_id: 'svc-1'
    }
  },
  {
    id: 'ra3',
    createdAt: '2026-04-20T15:00:00Z',
    updatedAt: '2026-04-24T13:00:00Z',
    application_no: 'RC-2026-00003',
    applicant_cid: '11801002345',
    applicant_name: 'Thinley Dorji',
    applicant_contact_no: '17998877',
    relationship_to_cid: '11801003456',
    relationship_to_name: 'Choki Wangmo',
    purpose_id: 'pur-3',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'ASSESSED',
    purpose: {
      id: 'pur-3',
      createdAt: '',
      updatedAt: '',
      name: 'Visa Application'
    },
    fee: {
      id: 'fee-ra3',
      application_no: 'RC-2026-00003',
      amount: 300,
      status: 'PAID',
      transaction_no: 'TXN-20260424-003',
      contact_no: '17998877',
      payment_service_type_id: 'svc-1'
    }
  }
];

export function ApprovalTable() {
  const [applications, setApplications] =
    useState<RelationshipApplicationApproval[]>(ALL_APPLICATIONS);
  const [q] = useQueryState('q', parseAsString.withDefault(''));

  useEffect(() => {
    const doneIds = getRcApprovalDoneIds();
    if (doneIds.size > 0) {
      setApplications(ALL_APPLICATIONS.filter((a) => !doneIds.has(a.id)));
    }
  }, []);

  const filtered = useMemo(() => {
    if (!q) return applications;
    const lower = q.toLowerCase();
    return applications.filter((app) => {
      const applicantName = (app.applicant_name ?? '').toLowerCase();
      const applicantCid = (app.applicant_cid ?? '').toLowerCase();
      const relationshipToName = (app.relationship_to_name ?? '').toLowerCase();
      const relationshipToCid = (app.relationship_to_cid ?? '').toLowerCase();
      const applicationNo = (app.application_no ?? '').toLowerCase();
      return (
        applicantName.includes(lower) ||
        applicantCid.includes(lower) ||
        relationshipToName.includes(lower) ||
        relationshipToCid.includes(lower) ||
        applicationNo.includes(lower)
      );
    });
  }, [applications, q]);

  return (
    <DataTable
      columns={approvalColumns}
      data={filtered}
      totalItems={filtered.length}
    />
  );
}
