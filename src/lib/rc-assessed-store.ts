const assessedIds = new Set<string>();
const paymentDoneIds = new Set<string>();
const approvalDoneIds = new Set<string>();

export function markRcAssessed(id: string) {
  assessedIds.add(id);
}

export function isRcAssessed(id: string) {
  return assessedIds.has(id);
}

export function getRcAssessedIds(): Set<string> {
  return assessedIds;
}

export function markRcPaymentDone(id: string) {
  paymentDoneIds.add(id);
}

export function getRcPaymentDoneIds(): Set<string> {
  return paymentDoneIds;
}

export function markRcApprovalDone(id: string) {
  approvalDoneIds.add(id);
}

export function getRcApprovalDoneIds(): Set<string> {
  return approvalDoneIds;
}
