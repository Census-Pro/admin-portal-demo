const assessedIds = new Set<string>();
const paymentDoneIds = new Set<string>();
const approvalDoneIds = new Set<string>();

export function markNcAssessed(id: string) {
  assessedIds.add(id);
}

export function getNcAssessedIds(): Set<string> {
  return assessedIds;
}

export function markNcPaymentDone(id: string) {
  paymentDoneIds.add(id);
}

export function getNcPaymentDoneIds(): Set<string> {
  return paymentDoneIds;
}

export function markNcApprovalDone(id: string) {
  approvalDoneIds.add(id);
}

export function getNcApprovalDoneIds(): Set<string> {
  return approvalDoneIds;
}
