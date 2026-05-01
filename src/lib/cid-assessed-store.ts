const assessedIds = new Set<string>();
const paymentDoneIds = new Set<string>();
const approvalDoneIds = new Set<string>();

const renewalAssessedIds = new Set<string>();
const renewalPaymentDoneIds = new Set<string>();
const renewalApprovalDoneIds = new Set<string>();

const replacementAssessedIds = new Set<string>();
const replacementPaymentDoneIds = new Set<string>();
const replacementApprovalDoneIds = new Set<string>();

// Fresh
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

// Renewal
export function markCidRenewalAssessed(id: string) {
  renewalAssessedIds.add(id);
}
export function getCidRenewalAssessedIds(): Set<string> {
  return renewalAssessedIds;
}

export function markCidRenewalPaymentDone(id: string) {
  renewalPaymentDoneIds.add(id);
}
export function getCidRenewalPaymentDoneIds(): Set<string> {
  return renewalPaymentDoneIds;
}

export function markCidRenewalApprovalDone(id: string) {
  renewalApprovalDoneIds.add(id);
}
export function getCidRenewalApprovalDoneIds(): Set<string> {
  return renewalApprovalDoneIds;
}

// Replacement
export function markCidReplacementAssessed(id: string) {
  replacementAssessedIds.add(id);
}
export function getCidReplacementAssessedIds(): Set<string> {
  return replacementAssessedIds;
}

export function markCidReplacementPaymentDone(id: string) {
  replacementPaymentDoneIds.add(id);
}
export function getCidReplacementPaymentDoneIds(): Set<string> {
  return replacementPaymentDoneIds;
}

export function markCidReplacementApprovalDone(id: string) {
  replacementApprovalDoneIds.add(id);
}
export function getCidReplacementApprovalDoneIds(): Set<string> {
  return replacementApprovalDoneIds;
}

// Move-in-out Relieving
const verifiedRelievingIds = new Set<string>();

export function markRelievingVerified(id: string) {
  verifiedRelievingIds.add(id);
}
export function getVerifiedRelievingIds(): Set<string> {
  return verifiedRelievingIds;
}

// Move-in-out Receiving/Endorse
const endorsedReceivingIds = new Set<string>();

export function markReceivingEndorsed(id: string) {
  endorsedReceivingIds.add(id);
}
export function getEndorsedReceivingIds(): Set<string> {
  return endorsedReceivingIds;
}

// Move-in-out Receiving/Approve
const approvedReceivingIds = new Set<string>();

export function markReceivingApproved(id: string) {
  approvedReceivingIds.add(id);
}
export function getApprovedReceivingIds(): Set<string> {
  return approvedReceivingIds;
}
