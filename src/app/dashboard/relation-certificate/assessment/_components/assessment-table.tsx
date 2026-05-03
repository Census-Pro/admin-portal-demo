'use client';

import { useState, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { columns, RelationshipApplication } from '../../_components/columns';
import { getRcAssessedIds } from '@/lib/rc-assessed-store';
import { useQueryState, parseAsString } from 'nuqs';

const ALL_APPLICATIONS: RelationshipApplication[] = [
  {
    id: 'rc1',
    createdAt: '2026-04-08T09:00:00Z',
    updatedAt: '2026-04-08T09:00:00Z',
    application_no: 'RC-2026-00001',
    applicant_cid: '11801000123',
    applicant_name: 'Karma Tshering',
    applicant_contact_no: '17654321',
    relationship_to_cid: '11801000456',
    relationship_to_name: 'Pema Lhamo',
    purpose_id: 'pur-1',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'SUBMITTED',
    purpose: { id: 'pur-1', createdAt: '', updatedAt: '', name: 'Employment' }
  },
  {
    id: 'rc2',
    createdAt: '2026-04-14T11:30:00Z',
    updatedAt: '2026-04-14T11:30:00Z',
    application_no: 'RC-2026-00002',
    applicant_cid: '11801000789',
    applicant_name: 'Sonam Wangdi',
    applicant_contact_no: '17112233',
    relationship_to_cid: '11801001234',
    relationship_to_name: 'Dawa Zangmo',
    purpose_id: 'pur-2',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'SUBMITTED',
    purpose: { id: 'pur-2', createdAt: '', updatedAt: '', name: 'Bank Loan' }
  },
  {
    id: 'rc3',
    createdAt: '2026-04-20T15:00:00Z',
    updatedAt: '2026-04-20T15:00:00Z',
    application_no: 'RC-2026-00003',
    applicant_cid: '11801002345',
    applicant_name: 'Thinley Dorji',
    applicant_contact_no: '17998877',
    relationship_to_cid: '11801003456',
    relationship_to_name: 'Choki Wangmo',
    purpose_id: 'pur-3',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'SUBMITTED',
    purpose: {
      id: 'pur-3',
      createdAt: '',
      updatedAt: '',
      name: 'Visa Application'
    }
  }
];

export function AssessmentTable() {
  const [applications, setApplications] =
    useState<RelationshipApplication[]>(ALL_APPLICATIONS);
  const [q] = useQueryState('q', parseAsString.withDefault(''));

  useEffect(() => {
    const assessedIds = getRcAssessedIds();
    if (assessedIds.size > 0) {
      setApplications(ALL_APPLICATIONS.filter((a) => !assessedIds.has(a.id)));
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
    <DataTable columns={columns} data={filtered} totalItems={filtered.length} />
  );
}
