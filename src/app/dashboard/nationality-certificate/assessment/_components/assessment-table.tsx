'use client';

import { useState, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { columns, NationalityApplication } from '../../_components/columns';
import { getNcAssessedIds } from '@/lib/nc-assessed-store';
import { useQueryState, parseAsString } from 'nuqs';

const ALL_APPLICATIONS: NationalityApplication[] = [
  {
    id: '1',
    created_at: '2026-04-10T08:30:00Z',
    updated_at: '2026-04-10T08:30:00Z',
    application_no: 'NC-2026-00001',
    applicant_cid_no: '11801000123',
    applicant_contact_no: '17654321',
    applicant_is: 'SELF',
    minor_cid: '11815000101',
    minor_name: 'Pema Dorji',
    dob: null,
    parent_approval: 'APPROVED',
    application_status: 'SUBMITTED'
  },
  {
    id: '2',
    created_at: '2026-04-12T10:15:00Z',
    updated_at: '2026-04-12T10:15:00Z',
    application_no: 'NC-2026-00002',
    applicant_cid_no: '11801000456',
    applicant_contact_no: '17123456',
    applicant_is: 'PARENT',
    minor_cid: '11815000789',
    minor_name: 'Tenzin Wangchuk',
    dob: '2015-06-20',
    parent_approval: 'APPROVED',
    application_status: 'SUBMITTED'
  },
  {
    id: '3',
    created_at: '2026-04-18T14:00:00Z',
    updated_at: '2026-04-18T14:00:00Z',
    application_no: 'NC-2026-00003',
    applicant_cid_no: '11801000789',
    applicant_contact_no: '17987654',
    applicant_is: 'SELF',
    minor_cid: '11815000303',
    minor_name: 'Sonam Choden',
    dob: null,
    parent_approval: 'APPROVED',
    application_status: 'SUBMITTED'
  }
];

export function NcAssessmentTable() {
  const [applications, setApplications] =
    useState<NationalityApplication[]>(ALL_APPLICATIONS);
  const [q] = useQueryState('q', parseAsString.withDefault(''));

  useEffect(() => {
    const doneIds = getNcAssessedIds();
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
    <DataTable columns={columns} data={filtered} totalItems={filtered.length} />
  );
}
