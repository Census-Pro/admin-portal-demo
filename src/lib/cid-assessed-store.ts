const assessedIds = new Set<string>();
const paymentDoneIds = new Set<string>();
const approvalDoneIds = new Set<string>();

export function markCidAssessed(id: string) {
  assessedIds.add(id);
}

export function getCidAssessedIds(): Set<string> {
  return assessedIds;
}

export function markCidPaymentDone(id: string) {
  paymentDoneIds.add(id);
}

export function getCidPaymentDoneIds(): Set<string> {
  return paymentDoneIds;
}

export function markCidApprovalDone(id: string) {
  approvalDoneIds.add(id);
}

export function getCidApprovalDoneIds(): Set<string> {
  return approvalDoneIds;
}
